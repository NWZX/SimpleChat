import {
    ActivityItem,
    Persona,
    PrimaryButton,
    Separator,
    Link,
    IconButton,
    Text,
    PersonaPresence,
    Stack,
    ProgressIndicator,
} from '@fluentui/react';
import firebase from 'firebase/app';
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';
import { Card } from '@uifabric/react-cards';
import React, { useState } from 'react';
import NewPostDialog from './NewPostDialog';
import SettingsDialog from './SettingsDialog';

interface Props {
    userId?: string;
    action: () => void;
}

const ProfileView = ({ userId, action }: Props): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDialog = () => {
        setIsOpen(!isOpen);
    };
    const [isOpenSettings, setIsOpenSettings] = useState(false);
    const toggleDialogSettings = () => {
        setIsOpenSettings(!isOpenSettings);
    };
    if (!userId) {
        userId = window.localStorage.getItem('UID') || '';
    }
    const [user, loadingUser, errorUser] = useDocumentData<{
        username: string;
        lastActivity: firebase.firestore.Timestamp;
    }>(firebase.firestore().doc(`users/${userId}`));
    const [posts, loadingPosts, errorPosts] = useCollectionData<{
        id: string;
        content: string;
        likes: string[];
        dislike: string[];
    }>(firebase.firestore().collection('posts').where('userId', '==', userId));

    return (
        <>
            <Card tokens={{ childrenMargin: 10, padding: 20, maxWidth: 'none' }}>
                <Card.Item align="center">
                    <Persona
                        imageInitials={user?.username[0]}
                        hidePersonaDetails
                        presence={
                            firebase.firestore.Timestamp.now().toMillis() - (user?.lastActivity.toMillis() || 0) <
                            300 * 1000
                                ? PersonaPresence.online
                                : PersonaPresence.offline
                        }
                    />
                </Card.Item>
                <Card.Item align="center">
                    {userId != window.localStorage.getItem('UID') ? (
                        <PrimaryButton
                            iconProps={{ iconName: 'Chat' }}
                            text={`Chat with ${user?.username}`}
                            onClick={action}
                        />
                    ) : (
                        <Stack horizontal tokens={{ childrenGap: 2 }}>
                            <Stack.Item>
                                <PrimaryButton
                                    iconProps={{ iconName: 'CommentAdd' }}
                                    text="New Post"
                                    onClick={toggleDialog}
                                />
                            </Stack.Item>
                            <Stack.Item>
                                <PrimaryButton
                                    iconProps={{ iconName: 'PlayerSettings' }}
                                    text="Username"
                                    onClick={toggleDialogSettings}
                                />
                            </Stack.Item>
                        </Stack>
                    )}
                </Card.Item>
                <Card.Item>
                    <Separator />
                </Card.Item>
                <Card.Section styles={{ root: { overflowY: 'auto' } }}>
                    {loadingPosts && <ProgressIndicator />}
                    {posts?.map((v) => {
                        return (
                            <ActivityItem
                                key={'post_' + v.id}
                                activityDescription={[
                                    <Link key={0}>{user?.username}</Link>,
                                    <Text key={1} variant="tiny">
                                        , Today
                                    </Text>,
                                ]}
                                comments={[<span key={0}>{v.content}</span>]}
                                activityPersonas={[{ imageInitials: 'N' }]}
                                timeStamp={[
                                    <IconButton
                                        key={0}
                                        iconProps={{ iconName: 'Like' }}
                                        title="Emoji"
                                        ariaLabel="Emoji"
                                    />,
                                    <IconButton
                                        key={1}
                                        iconProps={{ iconName: 'Dislike' }}
                                        title="Emoji"
                                        ariaLabel="Emoji"
                                    />,
                                ]}
                            />
                        );
                    })}
                </Card.Section>
            </Card>
            <NewPostDialog title="Add Post" subText="Share your idea :" open={isOpen} onClose={toggleDialog} />
            <SettingsDialog title="Profile settings" subText="" open={isOpenSettings} onClose={toggleDialogSettings} />
        </>
    );
};

export default ProfileView;
