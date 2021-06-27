import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';
import { String, Literal, Record, Union } from 'runtypes';

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

        const snap = await admin.firestore().collection('serviceKeys').doc(data.id).get();
        if (snap.exists) {
            (snap.data() as { user: admin.firestore.DocumentReference }).user.set(
                { status: { type: data.status, timestamp: admin.firestore.Timestamp.now().toMillis() } },
                { merge: true },
            );
            res.send({ code: 200 });
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        res.send({ code: 500, error: error.message });
    }
});

// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app);
