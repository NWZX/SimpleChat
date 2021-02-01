import { getFocusStyle, getTheme, ITheme, mergeStyleSets, Persona, PersonaPresence } from '@fluentui/react';
import React from 'react';
import firebase from 'firebase/app';

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
            '&:hover': { background: palette.neutralLight },
            '&:active': { background: palette.neutralLighter },
            transition: 'background 300ms',
        },
    ],
});

interface IContact {
    id: string;
    username: string;
    avatar?: string;
    lastActivity: firebase.firestore.Timestamp;
    action?: (userId: string) => void;
}

interface Props {}

const ContactItem = (item?: IContact): JSX.Element => {
    const isOnline = firebase.firestore.Timestamp.now().toMillis() - (item?.lastActivity.toMillis() || 0) < 300 * 1000;
    return (
        <div
            key={'contact_' + item?.id}
            className={classNames.itemCell}
            onClick={() => {
                item?.action && item.action(item.id);
            }}
        >
            <Persona
                text={item?.username}
                imageInitials={item?.username[0]}
                presence={isOnline ? PersonaPresence.online : PersonaPresence.offline}
            />
        </div>
    );
};

export default ContactItem;
