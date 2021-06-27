import { Navigate, useRoutes } from 'react-router-dom';
import MainLayout from 'src/layout/MainLayout';
import LoginView from 'src/views/auth/LoginView';
import RegisterView from 'src/views/auth/RegisterView';
import NotFoundView from 'src/views/404/NotFoundView';
import DashboardView from 'src/views/dashboard/DashboardView';
import { useApp } from './interfaces/AppContext';

const Routings = (): JSX.Element | null => {
    const appData = useApp();

    const routes = [
        {
            path: '/',
            element: <MainLayout />,
            children: [
                { path: 'login', element: appData.user ? <Navigate to="/" /> : <LoginView title="Login" /> },
                { path: 'register', element: appData.user ? <Navigate to="/" /> : <RegisterView title="Register" /> },
                { path: 'logout', element: <Navigate to="/login" /> },
                { path: '404', element: <NotFoundView title="Not Found" /> },
                { path: '/', element: appData.user ? <DashboardView title="Dashboard" /> : <Navigate to="/login" /> },
                { path: '*', element: <Navigate to="/404" /> },
            ],
        },
    ];
    const routing = useRoutes(routes);
    return <>{routing}</>;
};

export default Routings;
