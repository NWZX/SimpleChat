/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { IRoom, IUser } from '.';
import firebase from 'firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';

interface IApp {
    user?: IUser;
    rooms?: IRoom[];
    currentProfile?: string;
    currentRoom?: { room: IRoom; page: 'profile' | 'chat' };
}
const initialState: IApp = {
    user: undefined,
    rooms: undefined,
    currentProfile: undefined,
    currentRoom: undefined,
};

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
    }, [userData, roomsData]);

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
