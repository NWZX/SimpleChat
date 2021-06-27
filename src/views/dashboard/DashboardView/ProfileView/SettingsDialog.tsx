import { Dialog, DialogFooter, DialogType, IModalProps } from '@fluentui/react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ControlTextField from 'src/components/ControlTextField';
import { useApp } from 'src/interfaces/AppContext';
import FluentButton from 'src/components/FluentButton';

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
        styles: { main: { maxWidth: '50%', borderRadius: '10px' } },
    };
    const dialogContentProps = {
        type: DialogType.normal,
        title: title,
        subText: subText,
    };
    const { control, setValue, handleSubmit } = useForm<Inputs>({
        resolver: yupResolver(schema), // yup, joi and even your own.
    });
    const { user } = useApp();

    useEffect(() => {
        if (user) {
            setValue('username', user.username);
        }
    }, [setValue, user]);

    const onSuccess = async (data: Inputs): Promise<void> => {
        try {
            await user?.ref.set({ username: data.username }, { merge: true });
            onClose();
        } catch (error) {
            console.log(error);
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
                <ControlTextField
                    name="username"
                    control={control}
                    defaultValue=""
                    innerProps={{ label: 'Username :', type: 'text', required: true }}
                />
                <DialogFooter>
                    <FluentButton variant="primary" type="submit" text="Apply" />
                    <FluentButton onClick={onClose} text="Cancel" />
                </DialogFooter>
            </form>
        </Dialog>
    );
};

export default SettingsDialog;
