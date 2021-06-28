import { Navigate, useRoutes } from 'react-router-dom';
import MainLayout from 'src/layout/MainLayout';
import LoginView from 'src/views/auth/LoginView';
import RegisterView from 'src/views/auth/RegisterView';
import NotFoundView from 'src/views/404/NotFoundView';
import DashboardView from 'src/views/dashboard/DashboardView';
import { useApp } from './interfaces/AppContext';
import Loading from './views/Loading';

const Routings = (): JSX.Element | null => {
    const appData = useApp();

    const isReady = (elem: JSX.Element, needAuth: boolean, reverse = false): JSX.Element => {
        if (appData.ready) {
            if (reverse) {
                if (needAuth && appData.user) {
                    return <Navigate to="/" />;
                } else {
                    return elem;
                }
            }

            if (needAuth && appData.user) {
                return elem;
            } else if (!needAuth) {
                return elem;
            } else {
                return <Navigate to="/login" />;
            }
        } else {
            return <Loading title="Loading..." />;
        }
    };

    const routes = [
        {
            path: '/',
            element: <MainLayout />,
            children: [
                {
                    path: 'login',
                    element: isReady(<LoginView title="Login" />, true, true),
                },
                {
                    path: 'register',
                    element: isReady(<RegisterView title="Register" />, true, true),
                },
                { path: '404', element: <NotFoundView title="Not Found" /> },
                { path: '/', element: isReady(<DashboardView title="Dashboard" />, true) },
                { path: '*', element: <Navigate to="/404" /> },
            ],
        },
    ];
    const routing = useRoutes(routes);
    return <>{routing}</>;
};

export default Routings;
