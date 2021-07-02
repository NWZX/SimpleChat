/* eslint-disable */
importScripts('/__/firebase/8.6.8/firebase-app.js');
importScripts('/__/firebase/8.6.8/firebase-messaging.js');
importScripts('/__/firebase/init.js');
importScripts('nw.js');

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(execNotification);
