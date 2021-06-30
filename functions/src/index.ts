import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';
import { String, Literal, Record, Union } from 'runtypes';
import { getUsersByIds, IMessage, IRoom, IUser } from './interface';

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
            const senderSnap = await admin.firestore().collection('users').doc(message.senderId).get();
            const sender = senderSnap.data() as IUser;
            const users = await getUsersByIds(room.users);

            //Add each valid user to the list
            const tokens: string[] = [];
            const timestamp = admin.firestore.Timestamp.now().toMillis();

            users.forEach((u) => {
                if (u.status.type == 'away' && timestamp - u.status.timestamp < 7 * 24 * 3600 * 1000) {
                    tokens.push(...u.pushId);
                }
            });

            if (tokens.length < 1) {
                throw new Error('No valid user found');
            }

            //Send Notification
            const r = await admin.messaging().sendMulticast({
                tokens: tokens,
                notification: {
                    title: sender.username,
                    body: message.content.slice(0, 100),
                },
                webpush: {
                    notification: {
                        title: room.roomName,
                        body: message.content.slice(0, 100),
                        timestamp: message.createdAt,
                        vibrate: 200,
                        badge: 'https://simplechat-37da5.web.app/ressources/maskable_icon_x128.png',
                        icon: 'https://simplechat-37da5.web.app/ressources/maskable_icon_x192.png',
                        requireInteraction: false,
                        tag: 'sc-' + room.id,
                        renotify: true,
                    },
                    headers: { Urgency: 'normal' },
                    fcmOptions: { link: 'https://simplechat-37da5.web.app/' },
                },
            });
            
            functions.logger.log("t :", tokens);
            functions.logger.log("r :", r.responses);
            functions.logger.log("s: ", r.successCount, " e: ", r.failureCount);
        }
    } catch (error) {
        functions.logger.error(error.message);
    }
    
});
