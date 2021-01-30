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

const NewContactDialog = ({ open, onClose, title, subText }: Props): JSX.Element => {
    const onSuccess = (): void => {
        onClose();
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
            <TextField type="text" placeholder="Username" />
            <DialogFooter>
                <PrimaryButton onClick={onSuccess} text="Add" />
                <DefaultButton onClick={onClose} text="Cancel" />
            </DialogFooter>
        </Dialog>
    );
};

export default NewContactDialog;
