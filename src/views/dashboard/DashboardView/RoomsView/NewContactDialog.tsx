import React from 'react';
import { Dialog, DialogFooter, DialogType, IModalProps } from '@fluentui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ControlTextField from 'src/components/ControlTextField';
import { useApp } from 'src/interfaces/AppContext';
import FluentButton from 'src/components/FluentButton';
import { db, IRoom, IUser } from 'src/interfaces';

const alphanum = /^[a-z0-9]+$/i;

interface Props {
    open: boolean;
    onClose: () => void;
    title: string;
    subText: string;
}
type Inputs = {
    contact: string;
};

const schema = yup.object().shape({
    contact: yup
        .string()
        .min(3, 'Username too short')
        .max(20, 'Username too long')
        .matches(alphanum, 'Invalid character')
        .required(),
});

const NewContactDialog = ({ open, onClose, title, subText }: Props): JSX.Element => {
    const { control, handleSubmit } = useForm<Inputs>({
        resolver: yupResolver(schema), // yup, joi and even your own.
    });
    const { user } = useApp();

    const onSuccess = async (data: Inputs): Promise<void> => {
        try {
            const contactSnap = await db().collection('users').where('username', '==', data.contact).get();
            if (contactSnap.empty) {
                throw new Error('No match');
            }
            const contact = {
                ...(contactSnap.docs[0].data() as IUser),
                id: contactSnap.docs[0].id,
                ref: contactSnap.docs[0].ref,
            };
            //NEED check for duplicat
            await db()
                .collection('rooms')
                .add({
                    roomName: `${user?.username},${contact.username}`,
                    users: [user?.id, contact.id],
                    createdAt: db.Timestamp.now().toMillis(),
                    updatedAt: db.Timestamp.now().toMillis(),
                } as Partial<IRoom>);
            onClose();
        } catch (error) {
            console.error(error.message);
        }
    };
    const modalProps: IModalProps = {
        isBlocking: false,
        styles: { main: { maxWidth: '50%', borderRadius: '10px' } },
    };
    const dialogContentProps = {
        type: DialogType.normal,
        title: title,
        subText: subText,
    };

    return (
        <Dialog
            hidden={!open}
            onDismiss={onClose}
            dialogContentProps={dialogContentProps}
            modalProps={modalProps}
            minWidth="30%"
            maxWidth="40%"
        >
            <form onSubmit={handleSubmit(onSuccess)}>
                <ControlTextField
                    name="contact"
                    control={control}
                    innerProps={{ label: 'Username :', type: 'text', required: true }}
                />
                <DialogFooter>
                    <FluentButton variant="primary" type="submit" text="Search & Add" />
                    <FluentButton onClick={onClose} text="Cancel" />
                </DialogFooter>
            </form>
        </Dialog>
    );
};

export default NewContactDialog;
