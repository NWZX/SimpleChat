/* eslint-disable */
export function execNotification(payload) {
    try {
        console.log('[firebase-messaging-sw.js] Received background message ', payload);
        // Customize notification here
        const { title, body, tag, ...notificationOptions } = payload.notification;
        if (!nofiticationObj[tag]) {
            nofiticationObj[tag] = { title: title, body: [body] };
        } else {
            nofiticationObj[tag].body.push(body);
        }

        const message = '';
        const i = 0;
        for (const [_, value] of Object.entries(nofiticationObj)) {
            if (i == 4) {
                message += 'more...';
                break;
            }
            const lengthFix = value.body.length - 1;
            const sup = lengthFix ? `(+${lengthFix})` : '';

            message += `${value.title}: ${value.body[lengthFix]}`.slice(0, 45) + `...` + sup + '\n';
            i++;
        }
        self.registration.showNotification('SC', { ...notificationOptions, tag: 'simple-chat-W0W', body: message });
    } catch (error) {
        console.log(error);
    }
}
