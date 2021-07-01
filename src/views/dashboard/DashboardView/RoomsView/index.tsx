import React, { useEffect, useState } from 'react';
import { Spinner, SpinnerSize, useTheme } from '@fluentui/react';
import { Card } from '@uifabric/react-cards';
import RoomItem from './RoomItem';
import NewContactDialog from './NewContactDialog';
import firebase from 'firebase/app';
import { db, IRoom, IUser } from 'src/interfaces';
import { useApp } from 'src/interfaces/AppContext';
import FluentButton from 'src/components/FluentButton';
import { FluentCard } from 'src/components/FluentCard';
import { FluentGrid, FluentGridItem } from 'src/components/FluentGrid';

interface Props {
    openContactNew?: boolean;
}
const RoomsView = ({ openContactNew = false }: Props): JSX.Element => {
    const { user, rooms } = useApp();
    const theme = useTheme();

    const [isOpen, setIsOpen] = useState(openContactNew);
    const toggleDialog = () => {
        setIsOpen(!isOpen);
    };

    const [data, setData] = useState<IRoom[]>([]);
    useEffect(() => {
        if (user && rooms) {
            const defaultProfile: IRoom = {
                id: user.id,
                ref: db().collection('rooms').doc(),
                roomName: user.username,
                users: [],
                lastWritingActivity: { id: user.id, timestamp: 0 },
                lastMessage: 0,
                createdAt: 0,
                updatedAt: 0,
            };
            setData([defaultProfile, ...rooms]);
        }
    }, [rooms, user]);

    return (
        <>
            <FluentCard style={{ margin: 10 }} tokens={{ childrenMargin: 10, padding: 10, maxWidth: 'none' }}>
                <Card.Item>
                    <FluentGrid spacing={4}>
                        <FluentGridItem xs={5}>
                            <FluentButton
                                iconProps={{ iconName: 'SignOut' }}
                                text="Logout"
                                fullWidth
                                onClick={() => {
                                    const timestamp = firebase.firestore.Timestamp.now().toMillis();
                                    user?.ref.set({ status: { type: 'offline', timestamp } } as Partial<IUser>, {
                                        merge: true,
                                    });
                                    //HERE ALL SERVICE MUST BE REMOVE
                                    firebase.auth().signOut();
                                }}
                            />
                        </FluentGridItem>
                        <FluentGridItem xs={7}>
                            <FluentButton
                                variant="primary"
                                iconProps={{ iconName: 'Add' }}
                                text="Add Contact"
                                fullWidth
                                onClick={toggleDialog}
                            />
                        </FluentGridItem>
                    </FluentGrid>
                </Card.Item>
                <Card.Item styles={{ root: { overflowY: 'auto', maxHeight: '50vh' } }}>
                    {!rooms ? (
                        <Spinner
                            styles={{ circle: { borderWidth: '0.4rem' } }}
                            size={SpinnerSize.large}
                            label="Search your contact..."
                            style={{ marginTop: theme.spacing.l1, marginBottom: theme.spacing.l1 }}
                        />
                    ) : (
                        data?.map((v) => <RoomItem key={v.id} item={v} />)
                    )}
                </Card.Item>
            </FluentCard>
            <NewContactDialog
                title="Add Contact"
                subText="Let's make new links with fabulous people out there..."
                open={isOpen}
                onClose={toggleDialog}
            />
        </>
    );
};

export default RoomsView;
