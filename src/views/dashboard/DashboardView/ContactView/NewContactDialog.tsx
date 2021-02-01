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
    const { control, handleSubmit, errors } = useForm<Inputs>({
        resolver: yupResolver(schema), // yup, joi and even your own.
    });
    const [error, setError] = useState<string | undefined>();
    const onSuccess = async (data: Inputs): Promise<void> => {
        try {
            const user = await firebase.firestore().collection('users').where('username', '==', data.contact).get();
            if (user.empty) {
                throw new Error('No match');
            }
            await firebase
                .firestore()
                .collection('users')
                .doc(window.localStorage.getItem('UID') || '')
                .update({ contact: firebase.firestore.FieldValue.arrayUnion(user.docs[0].id) });
            await firebase
                .firestore()
                .collection('users')
                .doc(user.docs[0].id)
                .update({ contact: firebase.firestore.FieldValue.arrayUnion(window.localStorage.getItem('UID')) });
            onClose();
        } catch (error) {
            setError(error.message);
        }
    };
    const modalProps: IModalProps = {
        isBlocking: false,
        styles: { main: { maxWidth: 450 } },
    };
    const dialogContentProps = {
        type: DialogType.normal,
        title: title,
        subText: subText,
    };

    return (
        <Dialog hidden={!open} onDismiss={onClose} dialogContentProps={dialogContentProps} modalProps={modalProps}>
            <form onSubmit={handleSubmit(onSuccess)}>
                <Controller
                    as={TextField}
                    label="Username :"
                    name="contact"
                    control={control}
                    defaultValue=""
                    type="text"
                    errorMessage={errors.contact?.message || error}
                    required
                />
                <DialogFooter>
                    <PrimaryButton type="submit" text="Add" />
                    <DefaultButton onClick={onClose} text="Cancel" />
                </DialogFooter>
            </form>
        </Dialog>
    );
};

export default NewContactDialog;
