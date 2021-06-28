/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { createContext, useContext, useEffect, useReducer, ReactNode, useState } from 'react';
import { IRoom, IUser } from '.';
import firebase from 'firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';

interface IApp {
    user?: IUser;
    rooms?: IRoom[];
    currentProfile?: string;
    currentRoom?: { room: IRoom; page: 'profile' | 'chat' };
    serviceKey?: string;
}
const initialState: IApp = {
    user: undefined,
    rooms: undefined,
    currentProfile: undefined,
    currentRoom: undefined,
    serviceKey: undefined,
};

function getServiceKey(): Promise<string | undefined> {
    return new Promise(function (resolve, reject) {
        try {
            if (!window.indexedDB) {
                console.log(
                    "Votre navigateur ne supporte pas une version stable d'IndexedDB. Quelques fonctionnalités ne seront pas disponibles.",
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
                    "Votre navigateur ne supporte pas une version stable d'IndexedDB. Quelques fonctionnalités ne seront pas disponibles.",
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
    const db = firebase.firestore();

    const [data, dispatchData] = useReducer(reducer, initialState);
    const [lock, setLock] = useState(false);
    const [user] = useAuthState(firebase.auth());
    const [userData] = useDocumentData<IUser>(user?.uid ? db.collection('users').doc(user.uid) : undefined, {
        idField: 'id',
        refField: 'ref',
    });
    const [roomsData] = useCollectionData<IRoom>(
        user?.uid ? db.collection('rooms').where('users', 'array-contains', user.uid) : undefined,
        {
            idField: 'id',
            refField: 'ref',
        },
    );

    useEffect(() => {
        (async () => {
            if (userData) {
                const serviceKey = await getServiceKey();
                if (!data.serviceKey && !serviceKey && !lock) {
                    setLock(true);
                    const x = await db.collection('serviceKeys').where('user', '==', userData.ref).get();
                    if (!x.empty) {
                        dispatchData({ type: 'set-service-key', payload: { serviceKey: x.docs[0].id } });
                    } else {
                        const tempKey = await db.collection('serviceKeys').add({ user: userData.ref });
                        dispatchData({ type: 'set-service-key', payload: { serviceKey: tempKey.id } });
                    }
                    setLock(false);
                }

                dispatchData({ type: 'set-user', payload: { user: userData } });
                dispatchData({ type: 'set-profile', payload: { currentProfile: userData.id } });
            } else {
                dispatchData({ type: 'set-user', payload: { user: undefined } });
                dispatchData({ type: 'set-profile', payload: { currentProfile: undefined } });
            }
        })();
        (async () => {
            if (roomsData) {
                dispatchData({ type: 'set-rooms', payload: { rooms: roomsData } });
            } else {
                dispatchData({ type: 'set-rooms', payload: { rooms: undefined } });
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userData, roomsData, db]);

    return (
        <AppContext.Provider value={[data, (t, p) => dispatchData({ type: t, payload: p })]}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [context, dispatch] = useContext(AppContext);
    const changeRoom = (room: IRoom, page: 'profile' | 'chat') => {
        dispatch('set-room', { currentRoom: { room, page } });
        dispatch('set-profile', { currentProfile: undefined });
    };
    const exitRoom = () => {
        dispatch('set-profile', { currentProfile: context.user?.id });
        dispatch('set-room', { currentRoom: undefined });
    };
    return { ...context, changeRoom, exitRoom };
};
