importScripts('/__/firebase/8.6.8/firebase-app.js');
importScripts('/__/firebase/8.6.8/firebase-messaging.js');
importScripts('/__/firebase/init.js');

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(async function (payload) {
    try {
        console.log('[firebase-messaging-sw.js] Received background message ', payload);
        // Customize notification here
        const { title, ...notificationOptions } = payload.notification;
        await self.registration.showNotification(title, notificationOptions);
    } catch (error) {
        console.log(error);
    }
});
