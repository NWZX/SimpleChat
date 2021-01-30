import { Navigate } from 'react-router-dom';
import MainLayout from 'src/layout/MainLayout';
import LoginView from 'src/views/auth/LoginView';
import RegisterView from 'src/views/auth/RegisterView';
import NotFoundView from 'src/views/404/NotFoundView';
import DashboardView from 'src/views/dashboard/DashboardView';
import ChatView from 'src/views/dashboard/DashboardView/ChatView';

export default [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { path: 'login', element: <LoginView title="Login" /> },
            { path: 'register', element: <RegisterView title="Register" /> },
            { path: 'logout', element: <Navigate to="/login" /> },
            { path: '404', element: <NotFoundView title="Not Found" /> },
            { path: '/', element: <Navigate to="/dashboard" /> },
            { path: '/dashboard', element: <DashboardView title="Dashboard" /> },
            { path: '*', element: <Navigate to="/404" /> },
        ],
    },
];
