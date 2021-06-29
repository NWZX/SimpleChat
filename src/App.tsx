import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/messaging';
import firebase from 'firebase/app';
import { FIREBASE_CONFIG } from './utils/config';
import Routings from './Routings';
import { AppProvider } from './interfaces/AppContext';
import { ThemeProvider } from '@fluentui/react';
import theme from 'src/theme';

if (firebase.apps.length === 0) {
    firebase.initializeApp(FIREBASE_CONFIG);
    firebase
        .firestore()
        .enablePersistence()
        .catch((err) => {
            if (err.code == 'failed-precondition') {
                // Multiple tabs open, persistence can only be enabled
                // in one tab at a a time.
                // ...
            } else if (err.code == 'unimplemented') {
                // The current browser does not support all of the
                // features required to enable persistence
                // ...
            }
            console.log(err);
        });
    firebase.messaging().onMessage((payload) => {
        console.log('Message received. ', payload);
        navigator.serviceWorker.ready.then((registration) => {
            const { title, ...notificationOptions } = payload.notification;
            registration.showNotification(title, notificationOptions);
        });
    });
}

const App = (): JSX.Element => {
    return (
        <AppProvider>
            <ThemeProvider theme={theme} style={{ minHeight: '100vh' }}>
                <Routings />
            </ThemeProvider>
        </AppProvider>
    );
};

export default App;
