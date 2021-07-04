import { Response, Request } from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { String, Record } from 'runtypes';
import { IUser } from './interface';

export async function SignUp(res: Response, req: Request): Promise<void> {
    const Body = Record({
        username: String,
        password: String,
        email: String,
    });

    try {
        //Check if the body is valid
        const body = Body.check(req.body);

        //Get the currentTime
        const currentTime = admin.firestore.Timestamp.now().toMillis();

        //Create a new user in firebase auth
        const newUser = await admin.auth().createUser({ email: body.email, password: body.password });
        await admin.auth().setCustomUserClaims(newUser.uid, { admin: false });

        //Create a new user object in firebase
        admin
            .firestore()
            .collection('users')
            .doc(newUser.uid)
            .set({
                username: body.username,
                status: { type: 'online', timestamp: currentTime },
                createdAt: currentTime,
                notifications: [],
                serviceKey: [],
                pushId: [],
            } as Partial<IUser>);
        
        //Generate a new token
        const token = await admin.auth().createCustomToken(newUser.uid);

        //Send the token
        res.status(200).json({code: 200, token })
    } catch (error) {
        functions.logger.error(error);
        res.status(500).json({code: 500, error: error.message});
    }
}
