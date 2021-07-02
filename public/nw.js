/* eslint-disable */
function execNotification(payload) {
    try {
        console.log('[firebase-messaging-sw.js] Received background message ', payload);
        // Customize notification here
        return self.registration.showNotification(payload.notification.title, payload.notification);
    } catch (error) {
        console.log(error);
    }
}
