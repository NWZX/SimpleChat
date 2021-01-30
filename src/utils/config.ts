interface IFIREBASE_CONFIG {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
}
export const FIREBASE_CONFIG = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG || '') as IFIREBASE_CONFIG;
