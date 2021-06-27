import { Persona, PersonaSize, Text } from '@fluentui/react';
import { Card } from '@uifabric/react-cards';
import React from 'react';
import { FluentCard } from 'src/components/FluentCard';
import { FluentGrid, FluentGridItem } from 'src/components/FluentGrid';
import { db, IUser } from 'src/interfaces';
import { useApp } from 'src/interfaces/AppContext';

interface Props {
    avatar?: string;
    usernames: IUser[];
    content: string;
    createdAt: number;
    sender: string;
}

const timeSplitter = (refTime: number): string => {
    const rest = (db.Timestamp.now().toMillis() - refTime) / 1000;
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

const MessageBuilder = ({ avatar, usernames, content, createdAt, sender }: Props): JSX.Element => {
    const { user } = useApp();
    const isFromSender = sender == user?.id;
    const currentUser = usernames.find((u) => u.id == sender) || user;

    const firstPart = (
        <FluentGridItem xs={2}>
            <Persona
                imageUrl={avatar}
                imageInitials={currentUser?.username.charAt(0)}
                hidePersonaDetails
                size={PersonaSize.size32}
            />
        </FluentGridItem>
    );
    const lastPart = (
        <FluentGridItem xs={10}>
            <FluentCard tokens={{ childrenMargin: 10, childrenGap: 0, maxWidth: '212px' }}>
                <Card.Item>
                    <Text block style={{ overflowWrap: 'break-word' }}>
                        {content}
                    </Text>
                </Card.Item>
                <Card.Item align={isFromSender ? 'end' : 'start'}>
                    <Text variant="tiny">{timeSplitter(createdAt)}</Text>
                </Card.Item>
            </FluentCard>
        </FluentGridItem>
    );

    return (
        <FluentGrid spacing={2} justify={isFromSender ? 'start' : 'end'} style={{ marginBottom: '2%' }}>
            <FluentGridItem xs={12}>
                {isFromSender ? (
                    <FluentGrid spacing={4} justify="center">
                        {firstPart}
                        {lastPart}
                    </FluentGrid>
                ) : (
                    <FluentGrid spacing={4} justify="center">
                        {lastPart}
                        {firstPart}
                    </FluentGrid>
                )}
            </FluentGridItem>
        </FluentGrid>
    );
};

export default MessageBuilder;
