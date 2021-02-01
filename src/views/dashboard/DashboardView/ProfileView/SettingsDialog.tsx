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
    username: string;
};

const schema = yup.object().shape({
    username: yup
        .string()
        .min(3, 'Username too short')
        .max(20, 'Username too long')
        .matches(alphanum, 'Invalid character')
        .required(),
});

const SettingsDialog = ({ open, onClose, title, subText }: Props): JSX.Element => {
    const modalProps: IModalProps = {
        isBlocking: false,
        styles: { main: { maxWidth: '50%' } },
    };
    const dialogContentProps = {
        type: DialogType.normal,
        title: title,
        subText: subText,
    };
    const { control, handleSubmit, errors } = useForm<Inputs>({
        resolver: yupResolver(schema), // yup, joi and even your own.
    });
    const [error, setError] = useState<string | undefined>();
    const onSuccess = async (data: Inputs): Promise<void> => {
        try {
            await firebase
                .firestore()
                .collection('users')
                .doc(window.localStorage.getItem('UID') || '')
                .update({ username: data.username });
            onClose();
        } catch (error) {
            setError(error);
        }
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
                    label="New Username :"
                    name="username"
                    control={control}
                    defaultValue=""
                    errorMessage={errors.username?.message || error}
                    type="text"
                    required
                />
                <DialogFooter>
                    <PrimaryButton type="submit" text="Apply" />
                    <DefaultButton onClick={onClose} text="Cancel" />
                </DialogFooter>
            </form>
        </Dialog>
    );
};

export default SettingsDialog;
