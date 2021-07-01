import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';
import { String, Literal, Record, Union } from 'runtypes';
import { getUsersByIds, IMessage, INotification, IRoom } from './interface';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

admin.initializeApp(functions.config().firebase);

const app = express();
// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// build multiple CRUD interfaces:
app.get('/updateStatus/:id/:status', async (req, res) => {
    try {
        const Status = Union(Literal('online'), Literal('away'), Literal('offline'));
        const Params = Record({
            id: String,
            status: Status,
        });
        const data = Params.check(req.params);

        const snap = await admin.firestore().collection('users').where("serviceKey", "array-contains", data.id).get();
        if (!snap.empty) {
            snap.docs[0].ref.set(
                { status: { type: data.status, timestamp: admin.firestore.Timestamp.now().toMillis() } },
                { merge: true },
            );
            res.send({ code: 200 });
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        functions.logger.error(error.message)
        res.send({ code: 500, error: error.message });
    }
});

// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app);
exports.createMessage = functions.firestore.document('messages/{messageId}').onCreate(async (snap) => {
    try {
        const message = { ...(snap.data() as IMessage), id: snap.id, ref: snap.ref };

        //Get the room `message` is from.
        const snapRoom = await admin.firestore().collection('rooms').doc(message.roomId).get();
        const room = { ...(snapRoom.data() as IRoom), id: snapRoom.id, ref: snapRoom.ref };
        if (room.users.length > 1) {
            const id = room.users.findIndex((v) => v == message.senderId)
            if (id != -1 && room.users.splice(id, 1).length != 1) {
                throw new Error("Invalid length");
            }

            //Get required users
            // const senderSnap = await admin.firestore().collection('users').doc(message.senderId).get();
            // const sender = senderSnap.data() as IUser;
            const users = await getUsersByIds(room.users);

            //Add each valid user to the list
            const timestamp = admin.firestore.Timestamp.now().toMillis();

            const customFilter = <T extends unknown>(
                arr: T[],
                predicate: (n: T, i: number) => boolean,
            ): [T, number][] => {
                const r: [T, number][] = new Array(arr.length);
                let c = 0;
                for (let i = 0; i < arr.length; i++) {
                    if (predicate(arr[i], i)) {
                        r[c] = [arr[i], i];
                        c++;
                    }
                }
                r.length = c;
                return r;
            };

            const bodyCompose = (notifications: { key: string; obj: INotification }[]): string => {
                let message = '';
                let stack = 0;
                const keyDiscriminant: string[] = [];
                
                let i = 1;
                while (notifications.length - i >= 0) {
                    const e = notifications[notifications.length - i];

                    if (stack === 3) {
                        message += 'More...';
                        break;
                    } else if (!keyDiscriminant.includes(e.key)) {
                        keyDiscriminant.push(e.key);
                        stack++;
                        const shrink = customFilter(notifications, (n) => n.key === e.key);
                        const notifNbr = shrink.length - 1;
                        const sup = notifNbr ? `(+${notifNbr})` : '';
                        message += e.obj.body + sup + '\n';
                        shrink.forEach((x) => notifications.splice(x[1], 1));
                        i = 0;
                    }
                    i++;
                }
                return message;
            };

            const newNotification: { key: string, obj: INotification } = {
                key: room.id,
                obj: {
                    body: `${room.roomName}: ${message.content.slice(0, 45)}${message.content.length > 45 ? '...' : ''}`,
                    timestamp: message.createdAt,
                }
            };
            users.forEach((u) => {
                if (u.status.type == 'away' && timestamp - u.status.timestamp < 7 * 24 * 3600 * 1000) {
                    u.ref.set({ notifications : admin.firestore.FieldValue.arrayUnion(newNotification)}, {merge: true});
                    u.pushId?.forEach((id) => {
                        const body = bodyCompose(u.notifications ? [...u.notifications, newNotification] : [newNotification]);
                        admin.messaging().send({
                            token: id,
                            notification: {
                                title: 'SC',
                                body: body,
                            },
                            webpush: {
                                notification: {
                                    title: 'SC',
                                    body: body,
                                    timestamp: message.createdAt,
                                    vibrate: 200,
                                    badge: 'https://simplechat-37da5.web.app/ressources/simple-chat-badge.png',
                                    icon: 'https://simplechat-37da5.web.app/ressources/maskable_icon_x192.png',
                                    tag: 'simplechatW0W',
                                    renotify: true,
                                },
                                headers: { Urgency: 'normal' },
                                fcmOptions: { link: 'https://simplechat-37da5.web.app/room/'+room.id },
                            },
                        });
                    });
                    
                }
            });
        }
    } catch (error) {
        functions.logger.error(error);
    }
    
});
