import React from 'react';
import { Helmet } from 'react-helmet';
import RoomsView from './RoomsView';
import ProfileView from './ProfileView';
import ChatView from './ChatView';
import { FluentGrid, FluentGridItem } from 'src/components/FluentGrid';
import { useApp } from 'src/interfaces/AppContext';
import FluentHidden from 'src/components/FluentHidden';

interface Props {
    title: string;
}

const SubPage: React.FC = () => {
    const { currentRoom } = useApp();

    switch (currentRoom?.page) {
        case 'profile':
            return <ProfileView />;
        case 'chat':
            return <ChatView />;

        default:
            return null;
    }
};

const DashboardView = ({ title }: Props): JSX.Element => {
    const { currentRoom } = useApp();
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
                        <RoomsView />
                    </FluentGridItem>
                ) : (
                    <FluentGridItem lg={3}>
                        <FluentHidden xs sm md>
                            <RoomsView />
                        </FluentHidden>
                    </FluentGridItem>
                )}

                <FluentGridItem xs={12} lg={9}>
                    <SubPage />
                </FluentGridItem>
            </FluentGrid>
        </>
    );
};

export default DashboardView;
