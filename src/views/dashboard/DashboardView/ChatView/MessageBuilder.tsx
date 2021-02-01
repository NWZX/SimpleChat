import { Persona, PersonaSize, Stack, Text } from '@fluentui/react';
import { Card } from '@uifabric/react-cards';
import firebase from 'firebase/app';
import React from 'react';

interface Props {
    avatar?: string;
    username?: string;
    content: string;
    createdAt: firebase.firestore.Timestamp;
    isFromSender?: boolean;
}

const timeSplitter = (refTime: Date): string => {
    const rest = (new Date().getTime() - refTime.getTime()) / 1000;
    if (rest < 10) {
        return `Now`;
    } else if (rest < 60) {
        return `${rest.toFixed(0)}s`;
    } else if (rest < 3600) {
        return `${(rest / 60).toFixed(0)}min`;
    } else if (rest < 86400) {
        return `${(rest / 3600).toFixed(0)}h`;
    } else {
        return new Date(refTime).toLocaleDateString();
    }
};

const MessageBuilder = ({ avatar, username, content, createdAt, isFromSender }: Props): JSX.Element => {
    const firstPart = (
        <Stack.Item>
            {avatar || username ? (
                <Persona
                    imageUrl={avatar}
                    imageInitials={username?.charAt(0)}
                    hidePersonaDetails
                    size={PersonaSize.size32}
                />
            ) : (
                <div style={{ height: 32, width: 32 }} />
            )}
        </Stack.Item>
    );
    const lastPart = (
        <Stack.Item>
            <Card tokens={{ childrenMargin: 10, childrenGap: 0 }}>
                <Card.Item>
                    <Text>{content}</Text>
                </Card.Item>
                <Card.Item align={isFromSender ? 'end' : 'start'}>
                    <Text variant="tiny">{timeSplitter(createdAt.toDate())}</Text>
                </Card.Item>
            </Card>
        </Stack.Item>
    );

    return (
        <Card.Item align={isFromSender ? 'start' : 'end'}>
            <Stack horizontal tokens={{ childrenGap: 10 }}>
                {isFromSender ? (
                    <>
                        {firstPart}
                        {lastPart}
                    </>
                ) : (
                    <>
                        {lastPart}
                        {firstPart}
                    </>
                )}
            </Stack>
        </Card.Item>
    );
};

export default MessageBuilder;
