import { Dialog, DialogFooter, DialogType, IModalProps, useTheme } from '@fluentui/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import firebase from 'firebase/app';
import ControlTextField from 'src/components/ControlTextField';
import { useApp } from 'src/interfaces/AppContext';
import FluentButton from 'src/components/FluentButton';

interface Props {
    open: boolean;
    onClose: () => void;
    title: string;
    subText: string;
}

type Inputs = {
    post: string;
};

const schema = yup.object().shape({
    post: yup.string().required(),
});

const NewPostDialog = ({ open, onClose, title, subText }: Props): JSX.Element => {
    const { user } = useApp();
    const theme = useTheme();
    const { control, handleSubmit } = useForm<Inputs>({
        resolver: yupResolver(schema), // yup, joi and even your own.
    });
    const onSuccess = async (data: Inputs): Promise<void> => {
        try {
            await firebase.firestore().collection('posts').add({
                content: data.post,
                createdAt: firebase.firestore.Timestamp.now(),
                dislike: [],
                likes: [],
                userId: user?.id,
            });
            onClose();
        } catch (error) {
            console.error(error.message);
        }
    };
    const modalProps: IModalProps = {
        isBlocking: false,
        styles: { main: { maxWidth: '50%', borderRadius: '10px', background: theme.palette.neutralLighterAlt } },
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
                    name="post"
                    control={control}
                    defaultValue=""
                    innerProps={{ type: 'text', required: true, multiline: true, rows: 15 }}
                />
                <DialogFooter>
                    <FluentButton variant="primary" type="submit" text="Send" />
                    <FluentButton onClick={onClose} text="Don't send" />
                </DialogFooter>
            </form>
        </Dialog>
    );
};

export default NewPostDialog;
