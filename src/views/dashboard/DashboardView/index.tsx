/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Helmet } from 'react-helmet';
import RoomsView from './RoomsView';
import ProfileView from './ProfileView';
import ChatView from './ChatView';
import { FluentGrid, FluentGridItem } from 'src/components/FluentGrid';
import { useApp } from 'src/interfaces/AppContext';
import FluentHidden from 'src/components/FluentHidden';
import { TRegistedAction } from 'src/interfaces';

interface Props {
    title: string;
}
type TLocationState = { action: TRegistedAction | undefined | null } & Record<string, any>;

const DashboardView = ({ title }: Props): JSX.Element => {
    const { currentRoom, changeRoom, rooms } = useApp();
    const location = useLocation();
    const navigate = useNavigate();
    const [params, setParams] = useState<Record<string, any>>({});

    // switch (state?.action) {
    //     case 'open-settings':
    //         changeRoom(undefined, 'profile');
    //         setParams({ openSettings: true });
    //         break;
    //     case 'open-post-new':
    //         changeRoom(undefined, 'profile');
    //         setParams({ openPostsNew: true });
    //         break;
    //     case 'open-contact-new':
    //         setParams({ openContactNew: true });
    //         break;
    //     case 'open-chat':
    //         const room = rooms?.find((r) => r.id == state.id);
    //         room && changeRoom(room, 'chat');
    //         break;
    //     default:
    //         setParams({});
    //         break;
    // }

    let SubPage = null;
    switch (currentRoom?.page) {
        case 'profile':
            SubPage = <ProfileView {...params} />;
            break;
        case 'chat':
            SubPage = <ChatView {...params} />;
            break;
        default:
            SubPage = null;
    }

    useEffect(() => {
        const state = location?.state ? (location?.state as TLocationState) : undefined;
        console.log('state:', state);
        if (state) {
            setTimeout(() => {
                navigate('/', { replace: true, state: {} });
            }, 1000);
        }
    }, [location?.state, navigate]);

    return (
        <>
            <Helmet>
                <title>{title}</title>
                <meta charSet="utf-8" />
                <link rel="canonical" href={window.location.href} />
            </Helmet>
            <FluentGrid style={{ minHeight: '100vh' }}>
                {!currentRoom || currentRoom.page == 'profile' ? (
                    <FluentGridItem lg={3}>
                        <RoomsView {...params} />
                    </FluentGridItem>
                ) : (
                    <FluentGridItem lg={3}>
                        <FluentHidden xs sm md>
                            <RoomsView {...params} />
                        </FluentHidden>
                    </FluentGridItem>
                )}

                <FluentGridItem xs={12} lg={9}>
                    {SubPage}
                </FluentGridItem>
            </FluentGrid>
        </>
    );
};

export default DashboardView;
