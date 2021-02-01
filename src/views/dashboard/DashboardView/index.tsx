import { Stack } from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import ContactView from './ContactView';
import ProfileView from './ProfileView';
import { isMobile } from 'react-device-detect';
import DashboardMobileView from './DashboardMobileView';
import ChatView from './ChatView';
import firebase from 'firebase/app';

interface Props {
    title: string;
}

const DashboardView = ({ title }: Props): JSX.Element => {
    const [selectdUserId, setSelectedUserId] = useState<string | undefined>(undefined);
    const [isChatting, setIsChatting] = useState(false);
    const [statusUpdate, setStatusUpdate] = useState(false);

    const changeSelectedUser = (userId: string): void => {
        setIsChatting(false);
        setSelectedUserId(userId);
    };
    const startChat = (): void => {
        setIsChatting(true);
    };

    if (!window.localStorage.getItem('UID') && firebase.auth().currentUser) {
        firebase.auth().signOut();
    }

    useEffect(() => {
        if (!statusUpdate) {
            firebase
                .firestore()
                .collection('users')
                .doc(window.localStorage.getItem('UID') || '')
                .update({ lastActivity: firebase.firestore.Timestamp.now() });
            setInterval(() => {
                firebase
                    .firestore()
                    .collection('users')
                    .doc(window.localStorage.getItem('UID') || '')
                    .update({ lastActivity: firebase.firestore.Timestamp.now() });
            }, 290 * 1000);
            setStatusUpdate(true);
        }
    }, [statusUpdate]);

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
                    {isChatting && selectdUserId ? (
                        <ChatView withUserId={selectdUserId} userId={window.localStorage.getItem('UID') || ''} />
                    ) : (
                        <ProfileView userId={selectdUserId} action={startChat} />
                    )}
                </Stack.Item>
            </Stack>
        </>
    );
};

export default DashboardView;
