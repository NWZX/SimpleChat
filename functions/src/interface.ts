import * as firebase from 'firebase-admin';

export const db = firebase.firestore;

export interface INotification {
    body: string;
    timestamp: number;
}

export interface IUser {
    id: string;

    ref: firebase.firestore.DocumentReference;
    status: { type: string; timestamp: number };

    serviceKey?: string[];
    pushId?: string[];

    username: string;
    notifications?: { key: string; obj: INotification }[];

    createdAt: number;
    updatedAt: number;
}

export interface IRoom {
    id: string;

    ref: firebase.firestore.DocumentReference;

    //Room name
    roomName: string;
    //Member of the room
    users: string[];
    //Last Writing activity
    lastWritingActivity: { id: string; timestamp: number };
    //Last message send
    lastMessage: number;

    createdAt: number;
    updatedAt: number;
}

export interface IMessage {
    id: string;

    ref: firebase.firestore.DocumentReference;

    roomId: string;
    senderId: string;

    content: string;

    createdAt: number;
    updatedAt: number;
}

export const getUsersByIds = async (ids: string[]): Promise<IUser[]> => {
    try {
        const raw: IUser[] = [];
        for (let i = 0; i < ids.length; i = i + 10) {
            const chuck = ids.slice(i, i + 10);
            const result = await db().collection('users').where(db.FieldPath.documentId(), 'in', chuck).get();
            result.forEach((t) => {
                raw.push({ ...(t.data() as IUser), id: t.id, ref: t.ref });
            });
        }
        return raw;
    } catch (error) {
        throw new Error(error.message);
    }
};
