/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { createContext, useContext, useEffect, useReducer, ReactNode, useState } from 'react';
import FingerprintJS, { Agent } from '@fingerprintjs/fingerprintjs';
import { db, IRoom, IUser } from '.';
import firebase from 'firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';

interface IApp {
    user?: IUser;
    rooms?: IRoom[];
    currentProfile?: string;
    currentRoom?: { room: IRoom; page: 'profile' | 'chat' };
    serviceKey?: string;
    fpService: Promise<Agent>;
    ready?: boolean;
}
const initialState: IApp = {
    user: undefined,
    rooms: undefined,
    currentProfile: undefined,
    currentRoom: undefined,
    serviceKey: undefined,
    fpService: FingerprintJS.load(),
    ready: false,
};

function displayNotificationBadges(count?: number) {
    if ('setAppBadge' in navigator && 'clearAppBadge' in navigator) {
        if (count && count > 0) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            navigator.setAppBadge(count);
        } else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            navigator.clearAppBadge();
        }
    }
}
function getServiceKey(): Promise<string | undefined> {
    return new Promise(function (resolve, reject) {
        try {
            if (!window.indexedDB) {
                console.log(
                    'Your browser does not support a stable version of IndexedDB. Some features will not be available.',
                );
            }
            const request = window.indexedDB.open('SCApp', 1);
            request.onupgradeneeded = function (e: any) {
                const db = e.target.result;

                // A versionchange transaction is started automatically.
                e.target.transaction.onerror = (e: any) => {
                    console.log(e);
                };

                if (db.objectStoreNames.contains('services')) {
                    db.deleteObjectStore('services');
                }

                db.createObjectStore('services');
            };

            request.onsuccess = function (e: any) {
                const db = e.target.result;
                const req = db.transaction('services').objectStore('services').get('servicesKey');
                req.onsuccess = () => {
                    resolve(req.result);
                };
            };
            request.onerror = (e) => {
                resolve(undefined);
                console.log(e);
            };
        } catch (error) {
            reject(undefined);
        }
    });
}

function setServiceKey(value: string) {
    return new Promise<void>(function (resolve, reject) {
        try {
            if (!window.indexedDB) {
                console.log(
                    'Your browser does not support a stable version of IndexedDB. Some features will not be available.',
                );
            }
            const request = window.indexedDB.open('SCApp', 1);
            request.onupgradeneeded = function (e: any) {
                const db = e.target.result;

                // A versionchange transaction is started automatically.
                e.target.transaction.onerror = (e: any) => {
                    console.log(e);
                };

                if (db.objectStoreNames.contains('services')) {
                    db.deleteObjectStore('services');
                }

                db.createObjectStore('services');
            };

            request.onsuccess = function (e: any) {
                const db = e.target.result;
                const req = db.transaction('services', 'readwrite').objectStore('services').put(value, 'servicesKey');
                req.onsuccess = () => {
                    resolve();
                };
            };

            request.onerror = (e) => {
                console.log(e);
            };
        } catch (error) {
            reject(error);
        }
    });
}
function reducer(state: IApp, action: { type: string; payload?: Record<string, any> }): IApp {
    switch (action.type) {
        case 'set-ready':
            return { ...state, ready: action.payload?.ready };
        case 'set-user':
            return { ...state, user: action.payload?.user };
        case 'set-rooms':
            return { ...state, rooms: action.payload?.rooms };
        case 'set-profile':
            return { ...state, currentProfile: action.payload?.currentProfile };
        case 'set-room':
            return { ...state, currentRoom: action.payload?.currentRoom };
        case 'set-service-key':
            setServiceKey(action.payload?.serviceKey);
            return { ...state, serviceKey: action.payload?.serviceKey };
        default:
            throw new Error();
    }
}

const AppContext = createContext<[IApp, (type: string, payload?: Record<string, any>) => void]>([
    initialState,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    () => {},
]);
export const AppProvider = ({ children }: { children: ReactNode }): JSX.Element => {
    const [data, dispatchData] = useReducer(reducer, initialState);
    const [lock, setLock] = useState(false);
    const [user, loadUser] = useAuthState(firebase.auth());
    const [userData, loadUserData, errorUserData] = useDocumentData<IUser>(
        user?.uid ? db().collection('users').doc(user.uid) : undefined,
        {
            idField: 'id',
            refField: 'ref',
        },
    );
    const [roomsData] = useCollectionData<IRoom>(
        user?.uid ? db().collection('rooms').where('users', 'array-contains', user.uid) : undefined,
        {
            idField: 'id',
            refField: 'ref',
        },
    );

    useEffect(() => {
        (async () => {
            try {
                //USER
                if (user && userData && roomsData) {
                    const serviceKey = await getServiceKey();
                    if (!data.serviceKey && !serviceKey && !lock) {
                        setLock(true);
                        const fp = await data.fpService;
                        const uid = (await fp.get()).visitorId;
                        if (userData.serviceKey && userData.serviceKey.includes(uid)) {
                            await userData.ref.set(
                                {
                                    serviceKey: firebase.firestore.FieldValue.arrayUnion(uid),
                                },
                                { merge: true },
                            );
                            dispatchData({ type: 'set-service-key', payload: { serviceKey: uid } });
                        } else {
                            const key = process.env.REACT_APP_PUSH_KEY;
                            const currentToken = await firebase.messaging().getToken({ vapidKey: key });

                            await userData.ref.set(
                                {
                                    serviceKey: firebase.firestore.FieldValue.arrayUnion(uid),
                                    pushId: firebase.firestore.FieldValue.arrayUnion(currentToken),
                                },
                                { merge: true },
                            );
                            dispatchData({ type: 'set-service-key', payload: { serviceKey: uid } });
                        }
                    }

                    displayNotificationBadges(userData.notifications?.length);
                    dispatchData({ type: 'set-user', payload: { user: userData } });
                    dispatchData({ type: 'set-profile', payload: { currentProfile: userData.id } });
                    dispatchData({ type: 'set-rooms', payload: { rooms: roomsData } });
                    dispatchData({
                        type: 'set-room',
                        payload: {
                            currentRoom: {
                                room: {
                                    id: userData.id,
                                    ref: db().collection('rooms').doc(),
                                    roomName: userData.username,
                                    users: [],
                                    lastWritingActivity: { id: userData.id, timestamp: 0 },
                                    lastMessage: 0,
                                    createdAt: 0,
                                    updatedAt: 0,
                                },
                                page: 'profile',
                            },
                        },
                    });
                    setLock(false);
                } else {
                    throw new Error();
                }
            } catch (error) {
                dispatchData({ type: 'set-user', payload: { user: undefined } });
                dispatchData({ type: 'set-profile', payload: { currentProfile: undefined } });
                dispatchData({ type: 'set-rooms', payload: { rooms: undefined } });
            }
        })();
        if (user && !loadUserData && !errorUserData && data.user) {
            dispatchData({ type: 'set-ready', payload: { ready: true } });
        }
        if (!user && !loadUser && !loadUserData && !errorUserData) {
            dispatchData({ type: 'set-ready', payload: { ready: true } });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userData, roomsData, user, loadUser, loadUserData, data]);

    return (
        <AppContext.Provider value={[data, (t, p) => dispatchData({ type: t, payload: p })]}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [context, dispatch] = useContext(AppContext);
    const changeRoom = (room: IRoom | undefined, page: 'profile' | 'chat') => {
        const defaultRoom = room || {
            currentRoom: {
                room: {
                    id: context.user?.id,
                    ref: db().collection('rooms').doc(),
                    roomName: context.user?.username,
                    users: [],
                    lastWritingActivity: { id: context.user?.id, timestamp: 0 },
                    lastMessage: 0,
                    createdAt: 0,
                    updatedAt: 0,
                },
                page: 'profile',
            },
        };
        dispatch('set-room', { currentRoom: { room: defaultRoom, page } });
        dispatch('set-profile', { currentProfile: undefined });
    };
    const exitRoom = () => {
        dispatch('set-profile', { currentProfile: context.user?.id });
        dispatch('set-room', { currentRoom: undefined });
    };
    return { ...context, changeRoom, exitRoom };
};
