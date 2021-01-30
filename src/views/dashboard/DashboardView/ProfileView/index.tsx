import {
    ActivityItem,
    Persona,
    PrimaryButton,
    Separator,
    Link,
    IconButton,
    Text,
    PersonaPresence,
} from '@fluentui/react';
import { Card } from '@uifabric/react-cards';
import React, { useState } from 'react';
import NewPostDialog from './NewPostDialog';

interface Props {
    userId?: string;
    action: () => void;
}

const ProfileView = ({ userId, action }: Props): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDialog = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <Card tokens={{ childrenMargin: 10, padding: 20, maxWidth: 'none' }}>
                <Card.Item align="center">
                    <Persona imageInitials={'N'} hidePersonaDetails presence={PersonaPresence.offline} />
                </Card.Item>
                <Card.Item align="center">
                    {userId ? (
                        <PrimaryButton iconProps={{ iconName: 'Chat' }} text="Chat with NWZX" onClick={action} />
                    ) : (
                        <PrimaryButton iconProps={{ iconName: 'CommentAdd' }} text="New Post" onClick={toggleDialog} />
                    )}
                </Card.Item>
                <Card.Item>
                    <Separator />
                </Card.Item>
                <Card.Section styles={{ root: { overflowY: 'auto' } }}>
                    <ActivityItem
                        key={0}
                        activityDescription={[
                            <Link key={0}>NWZX</Link>,
                            <Text key={1} variant="tiny">
                                , Today
                            </Text>,
                        ]}
                        comments={[<span key={0}>Hello! I am making a comment and mentioning</span>]}
                        activityPersonas={[{ imageInitials: 'N' }]}
                        timeStamp={[
                            <IconButton key={0} iconProps={{ iconName: 'Like' }} title="Emoji" ariaLabel="Emoji" />,
                            <IconButton key={1} iconProps={{ iconName: 'Dislike' }} title="Emoji" ariaLabel="Emoji" />,
                        ]}
                    />
                    <ActivityItem
                        key={1}
                        activityDescription={[
                            <Link key={0}>NWZX</Link>,
                            <Text key={1} variant="tiny">
                                , Yesterday
                            </Text>,
                        ]}
                        comments={[<span key={0}>Hello! I am making a comment and mentioning</span>]}
                        activityPersonas={[{ imageInitials: 'N' }]}
                        timeStamp={[
                            <IconButton key={0} iconProps={{ iconName: 'Like' }} title="Emoji" ariaLabel="Emoji" />,
                            <IconButton key={1} iconProps={{ iconName: 'Dislike' }} title="Emoji" ariaLabel="Emoji" />,
                        ]}
                    />
                    <ActivityItem
                        key={2}
                        activityDescription={[
                            <Link key={0}>NWZX</Link>,
                            <Text key={1} variant="tiny">
                                , {new Date().toLocaleTimeString()}
                            </Text>,
                        ]}
                        comments={[<span key={0}>Hello! I am making a comment and mentioning</span>]}
                        activityPersonas={[{ imageInitials: 'N' }]}
                        timeStamp={[
                            <IconButton key={0} iconProps={{ iconName: 'Like' }} title="Emoji" ariaLabel="Emoji" />,
                            <IconButton key={1} iconProps={{ iconName: 'Dislike' }} title="Emoji" ariaLabel="Emoji" />,
                        ]}
                    />
                </Card.Section>
            </Card>
            <NewPostDialog title="Add Post" subText="Share your idea :" open={isOpen} onClose={toggleDialog} />
        </>
    );
};

export default ProfileView;
