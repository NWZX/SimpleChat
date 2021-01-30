import {
    DefaultButton,
    Dialog,
    DialogFooter,
    DialogType,
    IModalProps,
    PrimaryButton,
    TextField,
} from '@fluentui/react';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface Props {
    open: boolean;
    onClose: () => void;
    title: string;
    subText: string;
}
type Inputs = {
    username: string;
    password: string;
};

const schema = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required(),
});

const SettingsDialog = ({ open, onClose, title, subText }: Props): JSX.Element => {
    const onSuccess = (): void => {
        onClose();
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
    const { control, handleSubmit } = useForm<Inputs>({
        resolver: yupResolver(schema), // yup, joi and even your own.
    });

    return (
        <Dialog
            hidden={!open}
            onDismiss={onClose}
            dialogContentProps={dialogContentProps}
            modalProps={modalProps}
            minWidth="30%"
            maxWidth="40%"
        >
            <form onSubmit={handleSubmit((d) => console.log(d))}></form>
            <Controller
                as={TextField}
                label="New Username :"
                name="username"
                control={control}
                defaultValue=""
                type="text"
                required
            />
            <DialogFooter>
                <PrimaryButton type="submit" text="Apply" />
                <DefaultButton onClick={onClose} text="Cancel" />
            </DialogFooter>
        </Dialog>
    );
};

export default SettingsDialog;
