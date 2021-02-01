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
import 'firebase/auth';
import firebase from 'firebase/app';
import { FIREBASE_CONFIG } from './utils/config';

if (firebase.apps.length === 0) {
    firebase.initializeApp(FIREBASE_CONFIG);
}

const auth = true;

export default [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { path: 'login', element: auth ? <Navigate to="/" /> : <LoginView title="Login" /> },
            { path: 'register', element: auth ? <Navigate to="/" /> : <RegisterView title="Register" /> },
            { path: 'logout', element: <Navigate to="/login" /> },
            { path: '404', element: <NotFoundView title="Not Found" /> },
            { path: '/', element: auth ? <DashboardView title="Dashboard" /> : <Navigate to="/login" /> },
            { path: '*', element: <Navigate to="/404" /> },
        ],
    },
];
