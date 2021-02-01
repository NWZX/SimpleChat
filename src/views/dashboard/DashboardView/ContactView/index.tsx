import React, { useEffect, useState } from 'react';
import { Card } from '@uifabric/react-cards';
import { List, PrimaryButton, ProgressIndicator, Stack } from '@fluentui/react';
import ContactItem from './ContactItem';
import NewContactDialog from './NewContactDialog';
import firebase from 'firebase/app';
import { useDocument, useCollection } from 'react-firebase-hooks/firestore';
import _ from 'lodash';

interface Props {
    userId?: string;
    itemAction: (userId: string) => void;
}
type IUser = {
    id: string;
    username: string;
    contact: [];
    lastActivity: firebase.firestore.Timestamp;
    action: (userId: string) => void;
};
const ContactView = ({ userId, itemAction }: Props): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDialog = () => {
        setIsOpen(!isOpen);
    };
    if (!userId) {
        userId = window.localStorage.getItem('UID') || '';
    }
    const [user, loadingUser] = useDocument(firebase.firestore().doc(`users/${userId}`));
    const [users, loadingUsers] = useCollection(
        user && !_.isEmpty(user.data().contact)
            ? firebase
                  .firestore()
                  .collection('users')
                  .where(firebase.firestore.FieldPath.documentId(), 'in', user?.data().contact)
            : null,
    );

    const [data, setData] = useState<IUser[]>([]);
    useEffect(() => {
        if (user) {
            const temp: IUser[] = [];
            const y = user.data();
            y.id = user.id;
            y.action = itemAction;
            temp.push(y);
            users?.docs.map((v: any) => {
                const g = v.data() as IUser;
                g.id = v.id;
                g.action = itemAction;
                temp.push(g);
            });
            setData(temp);
        }
    }, [itemAction, user, users]);

    return (
        <>
            <Stack tokens={{ childrenGap: 10 }} style={{ marginBottom: '2vh' }}>
                <Stack.Item grow>
                    <PrimaryButton
                        iconProps={{ iconName: 'SignOut' }}
                        text="Logout"
                        style={{ width: '100%' }}
                        onClick={() => {
                            window.localStorage.removeItem('UID');
                            firebase.auth().signOut();
                        }}
                    />
                </Stack.Item>
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
                {(loadingUser || loadingUsers) && <ProgressIndicator />}
                <Card.Item>
                    <List items={data} onRenderCell={ContactItem} />
                </Card.Item>
            </Card>
            <NewContactDialog title="Add Contact" subText="" open={isOpen} onClose={toggleDialog} />
        </>
    );
};

export default ContactView;
