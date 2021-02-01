import {
    DefaultButton,
    Dialog,
    DialogFooter,
    DialogType,
    IModalProps,
    PrimaryButton,
    TextField,
} from '@fluentui/react';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import firebase from 'firebase/app';

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
    const { control, handleSubmit, errors } = useForm<Inputs>({
        resolver: yupResolver(schema), // yup, joi and even your own.
    });
    const [error, setError] = useState<string | undefined>();
    const onSuccess = async (data: Inputs): Promise<void> => {
        try {
            await firebase
                .firestore()
                .collection('posts')
                .add({
                    content: data.post,
                    createdAt: firebase.firestore.Timestamp.now(),
                    dislike: [],
                    likes: [],
                    userId: window.localStorage.getItem('UID') || '',
                });
            onClose();
        } catch (error) {
            setError(error.message);
        }
    };
    const modalProps: IModalProps = {
        isBlocking: false,
        styles: { main: { maxWidth: '50%' } },
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
                <Controller
                    as={TextField}
                    name="post"
                    control={control}
                    defaultValue=""
                    type="text"
                    multiline
                    errorMessage={errors.post?.message || error}
                    required
                />
                <DialogFooter>
                    <PrimaryButton type="submit" text="Send" />
                    <DefaultButton onClick={onClose} text="Don't send" />
                </DialogFooter>
            </form>
        </Dialog>
    );
};

export default NewPostDialog;
