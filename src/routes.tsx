import { Navigate } from 'react-router-dom';
import MainLayout from 'src/layout/MainLayout';
import LoginView from 'src/views/auth/LoginView';
import RegisterView from 'src/views/auth/RegisterView';
import NotFoundView from 'src/views/404/NotFoundView';
import DashboardView from 'src/views/dashboard/DashboardView';
import ChatView from 'src/views/chat/ChatView';

export default [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { path: 'login', element: <LoginView /> },
            { path: 'register', element: <RegisterView /> },
            { path: 'logout', element: <Navigate to="/login" /> },
            { path: '404', element: <NotFoundView /> },
            { path: '/', element: <Navigate to="/dashboard" /> },
            { path: '/dashboard', element: <DashboardView /> },
            { path: '/chat', element: <ChatView /> },
            { path: '*', element: <Navigate to="/404" /> },
        ],
    },
];
