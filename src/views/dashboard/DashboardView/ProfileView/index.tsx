import {
    ActivityItem,
    Persona,
    Separator,
    Link,
    IconButton,
    Text,
    PersonaPresence,
    Stack,
    Spinner,
    SpinnerSize,
    useTheme,
} from '@fluentui/react';
import firebase from 'firebase/app';
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';
import { Card } from '@uifabric/react-cards';
import React, { useState } from 'react';
import NewPostDialog from './NewPostDialog';
import SettingsDialog from './SettingsDialog';
import { useApp } from 'src/interfaces/AppContext';
import FluentButton from 'src/components/FluentButton';
import { FluentCard } from 'src/components/FluentCard';
import { db, IUser } from 'src/interfaces';

interface Props {}

const ProfileView = ({}: Props): JSX.Element => {
    const theme = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const toggleDialog = () => {
        setIsOpen(!isOpen);
    };
    const [isOpenSettings, setIsOpenSettings] = useState(false);
    const toggleDialogSettings = () => {
        setIsOpenSettings(!isOpenSettings);
    };

    const { user, currentRoom, changeRoom } = useApp();
    const [userGet] = useDocumentData<IUser>(
        user?.id != currentRoom?.room?.id && currentRoom?.room?.users.length == 2
            ? db()
                  .collection('users')
                  .doc(currentRoom?.room?.users.find((u) => u != user?.id))
            : undefined,
        { idField: 'id', refField: 'ref' },
    );
    const [posts, loadingPosts] = useCollectionData<{
        id: string;
        content: string;
        likes: string[];
        dislike: string[];
    }>(
        db()
            .collection('posts')
            .where('userId', '==', currentRoom?.room?.users.find((u) => u != user?.id) || user?.id)
            .limit(20),
    );

    return (
        <>
            <FluentCard tokens={{ childrenMargin: 10, padding: 10, maxWidth: 'none' }} style={{ margin: 10 }}>
                <Card.Item align="center">
                    <Persona
                        imageInitials={userGet?.username[0]}
                        hidePersonaDetails
                        presence={
                            firebase.firestore.Timestamp.now().toMillis() - (user?.status.timestamp || 0) < 300 * 1000
                                ? PersonaPresence.online
                                : PersonaPresence.offline
                        }
                    />
                </Card.Item>
                <Card.Item align="center">
                    {currentRoom?.room.id != user?.id ? (
                        <FluentButton
                            iconProps={{ iconName: 'Chat' }}
                            text={`Chat with ${userGet?.username || '...'}`}
                            onClick={() => {
                                currentRoom && changeRoom(currentRoom.room, 'chat');
                            }}
                        />
                    ) : (
                        <Stack horizontal tokens={{ childrenGap: 5 }}>
                            <Stack.Item>
                                <FluentButton
                                    iconProps={{ iconName: 'CommentAdd' }}
                                    text="New Post"
                                    onClick={toggleDialog}
                                />
                            </Stack.Item>
                            <Stack.Item>
                                <FluentButton
                                    iconProps={{ iconName: 'PlayerSettings' }}
                                    text="Settings"
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
                    {loadingPosts && (
                        <Spinner
                            styles={{ circle: { borderWidth: '0.4rem' } }}
                            size={SpinnerSize.large}
                            label="Search what new..."
                            style={{ marginTop: theme.spacing.l1, marginBottom: theme.spacing.l1 }}
                        />
                    )}
                    {posts?.map((v) => {
                        return (
                            <ActivityItem
                                key={'post_' + v.id}
                                activityDescription={[
                                    <Link key={0}>{userGet?.username}</Link>,
                                    <Text key={1} variant="tiny">
                                        , Today
                                    </Text>,
                                ]}
                                comments={[<Text key={0}>{v.content}</Text>]}
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
            </FluentCard>
            <NewPostDialog
                title="New Post"
                subText="Share your idea with many others..."
                open={isOpen}
                onClose={toggleDialog}
            />
            <SettingsDialog
                title="Settings"
                subText="Customize your experience"
                open={isOpenSettings}
                onClose={toggleDialogSettings}
            />
        </>
    );
};

export default ProfileView;
