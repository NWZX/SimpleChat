import { PrimaryButton, Stack, TextField } from '@fluentui/react';
import { Card } from '@uifabric/react-cards';
import React from 'react';
import MessageBuilder from './MessageBuilder';

interface Props {}

const ChatView = ({}: Props): JSX.Element => {
    return (
        <>
            <Card
                style={{ overflowY: 'auto' }}
                tokens={{ childrenMargin: 0, maxWidth: 'none', padding: 20, height: '90vh' }}
            >
                <Card.Item align={'start'}>
                    <MessageBuilder
                        content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium iure autem quia distinctio."
                        createdAt={new Date()}
                        isFromSender
                        username="NWZX"
                    />
                </Card.Item>
                <Card.Item align={'end'}>
                    <MessageBuilder
                        content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium iure autem quia distinctio."
                        createdAt={new Date()}
                        username="NWZX"
                    />
                </Card.Item>

                <Card.Item align={'end'}>
                    <MessageBuilder
                        content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium iure autem quia distinctio."
                        createdAt={new Date()}
                    />
                </Card.Item>

                <Card.Item align={'start'}>
                    <MessageBuilder
                        content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium iure autem quia distinctio."
                        createdAt={new Date()}
                        isFromSender
                        username="NWZX"
                    />
                </Card.Item>

                <Card.Item align={'start'}>
                    <MessageBuilder
                        content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium iure autem quia distinctio."
                        createdAt={new Date()}
                        isFromSender
                    />
                </Card.Item>
            </Card>
            <Stack horizontal tokens={{ childrenGap: 10 }} style={{ marginTop: '2vh' }}>
                <Stack.Item grow>
                    <TextField multiline={false} />
                </Stack.Item>
                <Stack.Item>
                    <PrimaryButton iconProps={{ iconName: 'Send' }} text="Send" />
                </Stack.Item>
            </Stack>
        </>
    );
};

export default ChatView;
