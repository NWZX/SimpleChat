/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.
import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
importScripts('nw.js');

declare const self: ServiceWorkerGlobalScope;
//[0] : active | [1]: OldActive
let pageState: [number, number] = [1, 0];

clientsClaim();

// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
precacheAndRoute(self.__WB_MANIFEST);

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
    // Return false to exempt requests from being fulfilled by index.html.
    ({ request, url }: { request: Request; url: URL }) => {
        // If this isn't a navigation, skip.
        if (request.mode !== 'navigate') {
            return false;
        }

        // If this is a URL that starts with /_, skip.
        if (url.pathname.startsWith('/_')) {
            return false;
        }

        // If this looks like a URL for a resource, because it contains
        // a file extension, skip.
        if (url.pathname.match(fileExtensionRegexp)) {
            return false;
        }

        // Return true to signal that we want to use the handler.
        return true;
    },
    createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html'),
);

// An example runtime caching route for requests that aren't handled by the
// precache, in this case same-origin .png requests like those from in public/
registerRoute(
    // Add in any other file extensions or routing criteria as needed.
    ({ url }) =>
        url.origin === self.location.origin &&
        ['.png', '.jpg', '.gif'].includes(url.pathname.substr(url.pathname.length - 5)),
    // Customize this strategy as needed, e.g., by changing to CacheFirst.
    new StaleWhileRevalidate({
        cacheName: 'images',
        plugins: [
            // Ensure that once this runtime cache reaches a maximum size the
            // least-recently used images are removed.
            new ExpirationPlugin({ maxEntries: 50 }),
        ],
    }),
);

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    if (event.data && event.data.type === 'NOTIFICATION') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        event.waitUntil(execNotification(event.data.payload));
    }
    if (event.data && event.data.type === 'PAGE_OPEN') {
        pageState[0] = 1;
    }
    if (event.data && event.data.type === 'PAGE_HIDDEN') {
        pageState[0] = 0;
    }
    if (event.data && event.data.type === 'PAGE_CLOSE') {
        pageState = [0, 1];
        updateStatus();
    }
    if (event.data && event.data.type === 'STATUS_UPDATE') {
        if (pageState[0] != pageState[1]) {
            updateStatus().then((v) => {
                if (v) pageState[1] = pageState[0];
            });
        }
    }
});

// Any other custom service worker logic can go here.

async function updateStatus() {
    return new Promise<boolean>(function (resolve, reject) {
        try {
            if (self.indexedDB) {
                console.log('IndexedDB is supported');
                const request = self.indexedDB.open('SCApp', 1);

                request.onupgradeneeded = function (e: any) {
                    const db = e.target.result;

                    // A versionchange transaction is started automatically.
                    e.target.transaction.onerror = (e: any) => {
                        console.log(e);
                    };

                    if (db.objectStoreNames.contains('services')) {
                        db.deleteObjectStore('services');
                    }

                    db.createObjectStore('services');
                };

                request.onsuccess = function (e: any) {
                    const db = e.target.result;
                    const req = db.transaction('services').objectStore('services').get('servicesKey');

                    req.onsuccess = async () => {
                        const servicesKey = req.result;

                        // Actual updates
                        if (process.env.REACT_APP_API_GATEWAY && servicesKey) {
                            const raw = await fetch(
                                `${process.env.REACT_APP_API_GATEWAY}/updateStatus/${servicesKey}/${
                                    pageState[0] ? 'online' : 'away'
                                }`,
                            );
                            const result = (await raw.json()) as {
                                code: number;
                                error?: string;
                            };
                            if (result.code === 200) {
                                console.log('status sync ok');
                                resolve(true);
                            } else {
                                console.log('status sync err');
                                resolve(false);
                            }
                        }
                    };
                    req.onerror = function () {
                        console.log('[onerror]', request.error);
                        resolve(false);
                    };
                };
                request.onerror = function () {
                    console.log('[onerror]', request.error);
                    resolve(false);
                };
            }
        } catch (error) {
            console.log(error.message);
            reject(error);
        }
    });
}

self.addEventListener('periodicsync', (event: any) => {
    console.log(event.tag);
    if (event.tag === 'online') {
        console.log('Update status in background!');
        event.waitUntil(updateStatus());
        //for one off event
        //registration.periodicSync.unregister('periodicsync');
    }
});
