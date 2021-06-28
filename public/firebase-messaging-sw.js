// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
    apiKey: 'AIzaSyAljU0PZxc-zj4638bbKlXpdDMx3p9FVwc',
    authDomain: 'simplechat-37da5.firebaseapp.com',
    databaseURL: 'https://simplechat-37da5-default-rtdb.firebaseio.com',
    projectId: 'simplechat-37da5',
    storageBucket: 'simplechat-37da5.appspot.com',
    messagingSenderId: '530461918934',
    appId: '1:530461918934:web:95cbad1002900b1cd92b77',
    measurementId: 'G-VN3BGR6R0Y',
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    try {
        console.log('[firebase-messaging-sw.js] Received background message ', payload);
        // Customize notification here
        const notificationTitle = 'Background Message Title';
        const notificationOptions = {
            body: 'Background Message body.',
            icon: '/firebase-logo.png',
        };

        self.registration.showNotification(notificationTitle, notificationOptions);
    } catch (error) {
        console.log(error);
    }
});
