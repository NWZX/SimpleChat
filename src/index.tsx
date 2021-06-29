import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { initializeIcons } from '@fluentui/react';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import './index.css';

initializeIcons();

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
if (process.env.NODE_ENV == 'production') {
    serviceWorkerRegistration.register();

    (async function registerSync() {
        const registration = (await navigator.serviceWorker.ready) as ServiceWorkerRegistration & { periodicSync: any };
        try {
            console.log('Periodic Sync registration!');
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            const status = await navigator.permissions.query({ name: 'periodic-background-sync' });
            if (status.state !== 'granted') {
                throw new Error('');
            }
            await registration.periodicSync.register('online', {
                minInterval: 43200000,
            });
            console.log('Periodic Sync registered!');
        } catch {
            console.log('Periodic Sync could not be registered!');
        }
    })();

    (async function requestPushPermission() {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
        } else {
        }
    })();

    setInterval(async () => {
        navigator.serviceWorker.ready.then((registration) => {
            registration.active?.postMessage({
                type: 'STATUS_UPDATE',
            });
        });
    }, 15 * 1000);

    function handleVisibilityChange() {
        navigator.serviceWorker.ready.then((registration) => {
            if (document.visibilityState === 'hidden') {
                registration.active?.postMessage({
                    type: 'PAGE_HIDDEN',
                });
            } else {
                registration.active?.postMessage({
                    type: 'PAGE_OPEN',
                });
            }
        });
    }
    document.addEventListener('visibilitychange', handleVisibilityChange, false);

    window.onbeforeunload = function () {
        navigator.serviceWorker.ready.then((registration) => {
            registration.active?.postMessage({
                type: 'PAGE_CLOSE',
            });
        });
        return null;
    };
}
process.env.NODE_ENV == 'development' && serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
