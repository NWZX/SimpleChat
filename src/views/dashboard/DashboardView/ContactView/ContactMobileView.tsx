import React from 'react';
import { Card } from '@uifabric/react-cards';
import { List } from '@fluentui/react';
import ContactItem from './ContactItem';

const data = [
    {
        id: '1',
        username: 'NWZX',
        avatar: undefined,
        lastActivity: 1611954830,
    },
    {
        id: '2',
        username: 'Jack',
        avatar: undefined,
        lastActivity: 1611954830,
    },
    {
        id: '3',
        username: 'Pierre',
        avatar: undefined,
        lastActivity: 1611954830,
    },
    {
        id: '4',
        username: 'David',
        avatar: undefined,
        lastActivity: 1611954830,
    },
    {
        id: '5',
        username: 'Erick',
        avatar: undefined,
        lastActivity: 1611954830,
    },
];

interface Props {}

const ContactMobileView = ({}: Props): JSX.Element => {
    return <List items={data} onRenderCell={ContactItem} />;
};

export default ContactMobileView;
