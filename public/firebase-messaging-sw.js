// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = JSON.parse(
    atob(
        'eyJhcGlLZXkiOiJBSXphU3lBbGpVMFBaeGMtemo0NjM4YmJLbFhwZERNeDNwOUZWd2MiLCJhdXRoRG9tYWluIjoic2ltcGxlY2hhdC0zN2RhNS5maXJlYmFzZWFwcC5jb20iLCJkYXRhYmFzZVVSTCI6Imh0dHBzOi8vc2ltcGxlY2hhdC0zN2RhNS1kZWZhdWx0LXJ0ZGIuZmlyZWJhc2Vpby5jb20iLCJwcm9qZWN0SWQiOiJzaW1wbGVjaGF0LTM3ZGE1Iiwic3RvcmFnZUJ1Y2tldCI6InNpbXBsZWNoYXQtMzdkYTUuYXBwc3BvdC5jb20iLCJtZXNzYWdpbmdTZW5kZXJJZCI6IjUzMDQ2MTkxODkzNCIsImFwcElkIjoiMTo1MzA0NjE5MTg5MzQ6d2ViOjk1Y2JhZDEwMDI5MDBiMWNkOTJiNzciLCJtZWFzdXJlbWVudElkIjoiRy1WTjNCR1I2UjBZIn0=',
    ),
);

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(async (payload) => {
    try {
        console.log('[firebase-messaging-sw.js] Received background message ', payload);
        // Customize notification here
        const { title, ...notificationOptions } = payload.notification;
        await self.registration.showNotification(title, notificationOptions);
    } catch (error) {
        console.log(error);
    }
});
