/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { IRoom, IServiceKey, IUser } from '.';
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
    serviceKey: getServiceKey(),
};

function getServiceKey(): string | undefined {
    try {
        if (!window.indexedDB) {
            console.log(
                "Votre navigateur ne supporte pas une version stable d'IndexedDB. Quelques fonctionnalités ne seront pas disponibles.",
            );
        }
        const request = window.indexedDB.open('SCApp', 3);
        return request.transaction?.objectStore('services').get('servicesKey').result;
    } catch (error) {
        console.log(error);
        return undefined;
    }
}
function setServiceKey(value: string) {
    try {
        if (!window.indexedDB) {
            console.log(
                "Votre navigateur ne supporte pas une version stable d'IndexedDB. Quelques fonctionnalités ne seront pas disponibles.",
            );
        }
        const request = window.indexedDB.open('SCApp', 3);
        request.transaction?.objectStore('services').add(value, 'servicesKey');
    } catch (error) {
        console.log(error);
    }
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
    const [user] = useAuthState(firebase.auth());
    const [userData] = useDocumentData<IUser>(user?.uid ? db.collection('users').doc(user.uid) : undefined, {
        idField: 'id',
        refField: 'ref',
    });
    const [serviceKey] = useCollectionData<IServiceKey>(
        !userData || data.serviceKey ? undefined : db.collection('serviceKeys').where('user', '==', userData.ref),
        { idField: 'id' },
    );
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
                if (!data.serviceKey && (!serviceKey || serviceKey.length == 0)) {
                    const tempKey = await db.collection('serviceKeys').add({ user: userData });
                    dispatchData({ type: 'set-service-key', payload: { serviceKey: tempKey.id } });
                } else if (!data.serviceKey && serviceKey && serviceKey.length > 0) {
                    dispatchData({ type: 'set-service-key', payload: { serviceKey: serviceKey[0].id } });
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
    }, [userData, roomsData, serviceKey, data.serviceKey, db]);

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
