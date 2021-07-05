import React from 'react';
import { getFocusStyle, getTheme, ITheme, mergeStyleSets, Persona, PersonaPresence, Text } from '@fluentui/react';
import firebase from 'firebase/app';
import { useApp } from 'src/interfaces/AppContext';
import { db, IRoom, IUser } from 'src/interfaces';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { FluentGrid, FluentGridItem } from 'src/components/FluentGrid';

const theme: ITheme = getTheme();
const { palette, semanticColors } = theme;

const classNames = mergeStyleSets({
    itemCell: [
        getFocusStyle(theme, { inset: -1 }),
        {
            minHeight: 54,
            padding: 10,
            boxSizing: 'border-box',
            borderBottom: `1px solid ${semanticColors.bodyDivider}`,
            display: 'flex',
            '&:hover': {
                background: palette.neutralLight,
                boxShadow: 'rgb(0 0 0 / 6.5%) 0px 0.8px 1.8px 0px, rgb(0 0 0 / 5.5%) 0px 0.15px 0.45px 0px',
            },
            '&:active': { background: palette.neutralLighter, boxShadow: theme.effects.elevation4 },
            transition: 'background 300ms, box-shadow 300ms',
            borderRadius: '10px',
        },
    ],
    text: { color: '#FF1744' },
});

const RoomItem = ({ item }: { item?: IRoom }): JSX.Element | null => {
    const { changeRoom, user } = useApp();
    const [otherUser] = useDocumentData<IUser>(
        user?.id != item?.id && item?.users.length == 2
            ? db()
                  .collection('users')
                  .doc(item.users.find((u) => u != user?.id))
            : undefined,
    );
    if (!item) {
        return null;
    }

    const timestamp = firebase.firestore.Timestamp.now().toMillis();
    let coin: Record<string, any> = {};
    const lastActivity = otherUser?.status.timestamp || 0;

    const notifications = user?.notifications?.filter((n) => n.key == item.id);
    const hasNotification = notifications && notifications.length > 0;
    if (otherUser?.status.type == 'online' && timestamp - lastActivity < 2 * 3600 * 1000) {
        coin = { presence: PersonaPresence.online };
    } else if (otherUser?.status.type == 'away' || timestamp - lastActivity < 24 * 3600 * 1000) {
        coin = { presence: PersonaPresence.away };
    } else {
        coin = { presence: PersonaPresence.offline };
    }

    return (
        <div
            className={classNames.itemCell}
            onClick={() => {
                changeRoom(item, 'profile');
            }}
        >
            <FluentGrid>
                <FluentGridItem
                    xs={hasNotification ? 7 : 12}
                    md={hasNotification ? 6 : 12}
                    xl={hasNotification ? 5 : 12}
                >
                    <Persona
                        text={item.roomName}
                        imageInitials={otherUser?.username[0] || item.roomName[0]}
                        {...coin}
                    />
                </FluentGridItem>
                {hasNotification && (
                    <FluentGridItem xs={5} md={6} xl={7}>
                        <Text variant="smallPlus" className={classNames.text}>
                            {notifications?.length} Unread
                        </Text>
                    </FluentGridItem>
                )}
            </FluentGrid>
        </div>
    );
};

export default RoomItem;
