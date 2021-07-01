/* eslint-disable */
importScripts('/__/firebase/8.6.8/firebase-app.js');
importScripts('/__/firebase/8.6.8/firebase-messaging.js');
importScripts('/__/firebase/init.js');
importScripts('/nw.js');

// Retrieve firebase messaging
const messaging = firebase.messaging();
let nofiticationObj = {};

messaging.onBackgroundMessage(execNotification);

self.addEventListener('notificationclick', () => {
    nofiticationObj = {};
});
// self.addEventListener('notificationclose', () => {
//     nofiticationObj = {};
// });
