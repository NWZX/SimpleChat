import { Navigate, useNavigate, useParams, useRoutes } from 'react-router-dom';
import MainLayout from 'src/layout/MainLayout';
import LoginView from 'src/views/auth/LoginView';
import RegisterView from 'src/views/auth/RegisterView';
import NotFoundView from 'src/views/404/NotFoundView';
import DashboardView from 'src/views/dashboard/DashboardView';
import { useApp } from './interfaces/AppContext';
import Loading from './views/Loading';
import { useEffect } from 'react';
import { TRegistedAction } from './interfaces';

const NavigateWithQuery = ({ to, action }: { to: string; action: TRegistedAction }): JSX.Element => {
    const params = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (params) {
            navigate(to, { state: { action, ...params } });
        } else {
            navigate(to, { state: { action } });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <></>;
};

const Routings = (): JSX.Element | null => {
    const { ready, user } = useApp();

    const isReady = (elem: JSX.Element, needAuth: boolean, reverse = false): JSX.Element => {
        if (ready) {
            if (reverse) {
                if (needAuth && user) {
                    return <Navigate to="/" />;
                } else {
                    return elem;
                }
            }

            if (needAuth && user) {
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

                { path: '/settings', element: <NavigateWithQuery to="/" action={'open-settings'} /> },
                {
                    path: '/contact/new',
                    element: <NavigateWithQuery to="/" action={'open-contact-new'} />,
                },
                { path: '/post/new', element: <NavigateWithQuery to="/" action={'open-post-new'} /> },
                { path: '/room/:id', element: <NavigateWithQuery to="/" action={'open-chat'} /> },
                { path: '*', element: <Navigate to="/404" /> },
            ],
        },
    ];
    const routing = useRoutes(routes);
    return <>{routing}</>;
};

export default Routings;
