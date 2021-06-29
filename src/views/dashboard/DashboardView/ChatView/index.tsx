import { IconButton, Stack, Text } from '@fluentui/react';
import { Card } from '@uifabric/react-cards';
import React, { useRef, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import MessageBuilder from './MessageBuilder';
import firebase from 'firebase/app';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ControlTextField from 'src/components/ControlTextField';
import { useApp } from 'src/interfaces/AppContext';
import FluentButton from 'src/components/FluentButton';
import { FluentCard } from 'src/components/FluentCard';
import { db, getUsersByIds, IMessage, IUser } from 'src/interfaces';

interface Props {}

type Inputs = {
    content: string;
};
const schema = yup.object().shape({
    content: yup.string().required(),
});

const ChatView = ({}: Props): JSX.Element => {
    const { control, handleSubmit, setValue } = useForm<Inputs>({
        resolver: yupResolver(schema), // yup, joi and even your own.
    });
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState('');
    const [usernames, setUsernames] = useState<IUser[]>([]);
    const { user, currentRoom, changeRoom } = useApp();

    const [messages] = useCollectionData<IMessage>(
        db()
            .collection('messages')
            .where('roomId', '==', `${currentRoom?.room.id}`)
            .orderBy('createdAt')
            .limitToLast(30),
        { idField: 'id', refField: 'ref' },
    );

    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (currentRoom && !usernames.length) {
            (async () => {
                const result = await getUsersByIds(currentRoom?.room.users);
                setUsernames(result);
            })();
        }
        if (messages) ref.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentRoom, messages, user, usernames.length]);

    const handleSend = async (data: Inputs) => {
        try {
            if (user && currentRoom) {
                db()
                    .collection('messages')
                    .add({
                        content: data.content,
                        createdAt: firebase.firestore.Timestamp.now().toMillis(),
                        senderId: user.id,
                        roomId: currentRoom.room.id,
                    } as Partial<IMessage>);
                setValue('content', '');
            }
        } catch (error) {
            setError(error);
            setHasError(true);
        }
    };

    return (
        <>
            <FluentCard style={{ margin: 10 }} tokens={{ childrenMargin: 0, maxWidth: 'none', padding: 10 }}>
                <Card.Item>
                    <Stack>
                        <Stack.Item>
                            <IconButton
                                iconProps={{ iconName: 'Back' }}
                                title="Emoji"
                                ariaLabel="Emoji"
                                onClick={() => {
                                    currentRoom && changeRoom(currentRoom.room, 'profile');
                                }}
                            />
                            {hasError && <Text>{error}</Text>}
                        </Stack.Item>
                        <Stack.Item grow={10}>
                            <Stack style={{ overflowY: 'auto', overflowX: 'hidden', height: '80vh' }}>
                                {messages?.map((v) => (
                                    <Stack.Item key={'msg_' + v.id}>
                                        <MessageBuilder
                                            content={v.content}
                                            createdAt={v.createdAt}
                                            sender={v.senderId}
                                            usernames={usernames}
                                        />
                                    </Stack.Item>
                                ))}
                                <div ref={ref}></div>
                            </Stack>
                        </Stack.Item>
                        <Stack.Item>
                            <form onSubmit={handleSubmit(handleSend)}>
                                <Stack horizontal tokens={{ childrenGap: 10 }}>
                                    <Stack.Item grow>
                                        <ControlTextField
                                            name="content"
                                            control={control}
                                            defaultValue=""
                                            showError={false}
                                            innerProps={{
                                                type: 'text',
                                                autoFocus: true,
                                                autoComplete: 'off',
                                            }}
                                        />
                                    </Stack.Item>
                                    <Stack.Item>
                                        <FluentButton
                                            variant="primary"
                                            type="submit"
                                            iconProps={{ iconName: 'Send' }}
                                            text="Send"
                                        />
                                    </Stack.Item>
                                </Stack>
                            </form>
                        </Stack.Item>
                    </Stack>
                </Card.Item>
            </FluentCard>
        </>
    );
};

export default ChatView;
