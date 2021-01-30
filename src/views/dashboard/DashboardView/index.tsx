import { Stack } from '@fluentui/react';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import ContactView from './ContactView';
import ProfileView from './ProfileView';
import { isMobile } from 'react-device-detect';
import DashboardMobileView from './DashboardMobileView';
import ChatView from './ChatView';

interface Props {
    title: string;
}

const DashboardView = ({ title }: Props): JSX.Element => {
    const [selectdUserId, setSelectedUserId] = useState<string | undefined>(undefined);
    const [isChatting, setIsChatting] = useState(false);

    const changeSelectedUser = (userId: string): void => {
        console.log(userId);
        setIsChatting(false);
        setSelectedUserId(userId);
    };
    const startChat = (): void => {
        setIsChatting(true);
    };

    if (isMobile) {
        return <DashboardMobileView title={title} />;
    }
    return (
        <>
            <Helmet>
                <title>{title}</title>
                <meta charSet="utf-8" />
                <link rel="canonical" href={window.location.href} />
            </Helmet>
            <Stack
                horizontal
                horizontalAlign="center"
                verticalAlign="start"
                tokens={{ childrenGap: '3%' }}
                style={{ minHeight: 'inherit' }}
            >
                <Stack.Item grow={2}>
                    <ContactView itemAction={changeSelectedUser} />
                </Stack.Item>
                <Stack.Item grow={10}>
                    {isChatting ? <ChatView /> : <ProfileView userId={selectdUserId} action={startChat} />}
                </Stack.Item>
            </Stack>
        </>
    );
};

export default DashboardView;
