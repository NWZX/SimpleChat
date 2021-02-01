import React, { useState } from 'react';
import { useRoutes } from 'react-router-dom';
import 'firebase/auth';
import 'firebase/firestore';
import firebase from 'firebase/app';
import { FIREBASE_CONFIG } from './utils/config';
import { FirestoreProvider } from '@react-firebase/firestore';
import { Navigate } from 'react-router-dom';
import MainLayout from 'src/layout/MainLayout';
import LoginView from 'src/views/auth/LoginView';
import RegisterView from 'src/views/auth/RegisterView';
import NotFoundView from 'src/views/404/NotFoundView';
import DashboardView from 'src/views/dashboard/DashboardView';

/*
 * So why firebase init is here ?
 * Simple
 * Because it's doesn't work anywhere else ¯\_(ツ)_/¯
 * VERY VERY SIMPLE YES ?
 */
if (firebase.apps.length === 0) {
    firebase.initializeApp(FIREBASE_CONFIG);
}
const App = (): JSX.Element => {
    const [isAuth, setIsAuth] = useState(false);
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            const usersRef = firebase.firestore().collection('users');
            usersRef
                .where('authId', '==', firebase.auth().currentUser?.uid)
                .get()
                .then((e) => {
                    window.localStorage.setItem('UID', e.docs[0].id);
                    setIsAuth(true);
                });
        }
        !user && setIsAuth(false);
    });

    const routes = [
        {
            path: '/',
            element: <MainLayout />,
            children: [
                { path: 'login', element: isAuth ? <Navigate to="/" /> : <LoginView title="Login" /> },
                { path: 'register', element: isAuth ? <Navigate to="/" /> : <RegisterView title="Register" /> },
                { path: 'logout', element: <Navigate to="/login" /> },
                { path: '404', element: <NotFoundView title="Not Found" /> },
                { path: '/', element: isAuth ? <DashboardView title="Dashboard" /> : <Navigate to="/login" /> },
                { path: '*', element: <Navigate to="/404" /> },
            ],
        },
    ];
    const routing = useRoutes(routes);
    return (
        <FirestoreProvider {...FIREBASE_CONFIG} firebase={firebase}>
            {routing}
        </FirestoreProvider>
    );
};

export default App;
