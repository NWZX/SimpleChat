import React, { useState } from 'react';
import { Card } from '@uifabric/react-cards';
import { List, PrimaryButton, Stack } from '@fluentui/react';
import ContactItem from './ContactItem';
import NewContactDialog from './NewContactDialog';

interface Props {
    itemAction: (userId: string) => void;
}
const ContactView = ({ itemAction }: Props): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDialog = () => {
        setIsOpen(!isOpen);
    };
    const data = [
        {
            id: '1',
            username: 'NWZX',
            avatar: undefined,
            lastActivity: 1611954830,
            action: itemAction,
        },
        {
            id: '2',
            username: 'Jack',
            avatar: undefined,
            lastActivity: 1611954830,
            action: itemAction,
        },
        {
            id: '3',
            username: 'Pierre',
            avatar: undefined,
            lastActivity: 1611954830,
            action: itemAction,
        },
        {
            id: '4',
            username: 'David',
            avatar: undefined,
            lastActivity: 1611954830,
            action: itemAction,
        },
        {
            id: '5',
            username: 'Erick',
            avatar: undefined,
            lastActivity: 1611954830,
            action: itemAction,
        },
    ];

    return (
        <>
            <Stack horizontal style={{ marginBottom: '2vh' }}>
                <Stack.Item grow>
                    <PrimaryButton
                        iconProps={{ iconName: 'Add' }}
                        text="Add Contact"
                        style={{ width: '100%' }}
                        onClick={toggleDialog}
                    />
                </Stack.Item>
            </Stack>
            <Card style={{ overflowY: 'auto' }} tokens={{ childrenMargin: 10, maxWidth: 'none' }}>
                <Card.Item>
                    <List items={data} onRenderCell={ContactItem} />
                </Card.Item>
            </Card>
            <NewContactDialog
                title="Add Contact"
                subText="Tap the username of your contact :"
                open={isOpen}
                onClose={toggleDialog}
            />
        </>
    );
};

export default ContactView;
