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

interface Props {
    open: boolean;
    onClose: () => void;
    title: string;
    subText: string;
}

const NewPostDialog = ({ open, onClose, title, subText }: Props): JSX.Element => {
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

    return (
        <Dialog
            hidden={!open}
            onDismiss={onClose}
            dialogContentProps={dialogContentProps}
            modalProps={modalProps}
            minWidth="30%"
            maxWidth="40%"
        >
            <TextField multiline />
            <DialogFooter>
                <PrimaryButton onClick={onSuccess} text="Send" />
                <DefaultButton onClick={onClose} text="Don't send" />
            </DialogFooter>
        </Dialog>
    );
};

export default NewPostDialog;
