import { MessageBar, MessageBarType, PrimaryButton, Stack, TextField } from '@fluentui/react';
import { Card } from '@uifabric/react-cards';
import React, { useRef, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import MessageBuilder from './MessageBuilder';
import firebase from 'firebase/app';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface Props {
    withUserId: string;
    userId: string;
}

type Inputs = {
    content: string;
};
const schema = yup.object().shape({
    content: yup.string().required(),
});

const ChatView = ({ withUserId, userId }: Props): JSX.Element => {
    const { control, handleSubmit, reset } = useForm<Inputs>({
        resolver: yupResolver(schema), // yup, joi and even your own.
    });
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState('');
    const handleSend = async (data: Inputs) => {
        try {
            const temp: any = {
                content: data.content,
                createdAt: firebase.firestore.Timestamp.now(),
                sender: userId,
                receiver: withUserId,
                users: [`${userId},${withUserId}`, `${withUserId},${userId}`],
            };
            await firebase.firestore().collection('messages').add(temp);
            await firebase
                .firestore()
                .collection('users')
                .doc(window.localStorage.getItem('UID') || '')
                .update({ lastActivity: firebase.firestore.Timestamp.now() });
            reset();
        } catch (error) {
            setError(error);
            setHasError(true);
        }
    };
    const [messages] = useCollection(
        firebase
            .firestore()
            .collection('messages')
            .where('users', 'array-contains', `${userId},${withUserId}`)
            .orderBy('createdAt')
            .limitToLast(30),
    );
    let lastSender: string | undefined;
    const [user, setUser] = useState<string | undefined>();
    const [secondUser, setSecondUser] = useState<string | undefined>();
    const getUser = (sender?: string, oldSender?: string): string | undefined => {
        if (oldSender == sender) return undefined;
        else if (sender == userId) return user;
        else return secondUser;
    };
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (messages && !user && !secondUser) {
            firebase
                .firestore()
                .doc('users/' + withUserId)
                .get()
                .then((v) => {
                    setSecondUser(v.data()?.username);
                });
            firebase
                .firestore()
                .doc('users/' + userId)
                .get()
                .then((v) => {
                    setUser(v.data()?.username);
                });
        }
        if (messages) ref.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, secondUser, user, userId, withUserId]);

    return (
        <>
            {hasError && (
                <MessageBar
                    messageBarType={MessageBarType.error}
                    isMultiline={false}
                    dismissButtonAriaLabel="Close"
                    onDismiss={() => {
                        setHasError(false);
                    }}
                >
                    {error}
                </MessageBar>
            )}
            <Card
                style={{ overflowY: 'auto' }}
                tokens={{ childrenMargin: 0, maxWidth: 'none', padding: 20, height: '90vh' }}
            >
                {messages?.docs.map((v: any) => {
                    const d = v.data();
                    const msg = (
                        <MessageBuilder
                            key={'msg_' + v.id}
                            content={d.content}
                            createdAt={d.createdAt}
                            isFromSender={d.sender == userId}
                            username={getUser(d.sender, lastSender)}
                        />
                    );
                    lastSender = d.sender;
                    return msg;
                })}
                <div ref={ref}></div>
            </Card>
            <form onSubmit={handleSubmit(handleSend)} style={{ marginTop: '2vh' }}>
                <Stack horizontal tokens={{ childrenGap: 10 }}>
                    <Stack.Item grow>
                        <Controller
                            as={TextField}
                            name="content"
                            control={control}
                            defaultValue=""
                            type="text"
                            autoFocus
                            required
                        />
                    </Stack.Item>
                    <Stack.Item>
                        <PrimaryButton type="submit" iconProps={{ iconName: 'Send' }} text="Send" />
                    </Stack.Item>
                </Stack>
            </form>
        </>
    );
};

export default ChatView;
