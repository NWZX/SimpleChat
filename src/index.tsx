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

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
            // Check if periodicSync is supported
            if ('periodicSync' in registration) {
                // Request permission
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                navigator.permissions.query({ name: 'periodic-background-sync' }).then((status) => {
                    if (status.state === 'granted') {
                        try {
                            // Register new sync every 24 hours
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            //@ts-ignore
                            registration.periodicSync.register('online', {
                                minInterval: 60 * 1000, // 1 minutes
                            });
                            console.log('Periodic background sync registered!');
                        } catch (e) {
                            console.error(`Periodic background sync failed:\n${e}`);
                        }
                    } else {
                        // Periodic background sync cannot be used.
                    }
                });
            }
        });
    }

    function handleVisibilityChange() {
        navigator.serviceWorker.ready.then((registration) => {
            if (document.visibilityState === 'hidden') {
                registration.active?.postMessage({
                    type: 'PAGE_CLOSE',
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
