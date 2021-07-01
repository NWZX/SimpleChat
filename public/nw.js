/* eslint-disable */
function execNotification(payload) {
    try {
        console.log('[firebase-messaging-sw.js] Received background message ', payload);
        // Customize notification here
        const { title, ...notificationOptions } = payload.notification;
        
        self.registration.showNotification(title, ...notificationOptions);
    } catch (error) {
        console.log(error);
    }
}
