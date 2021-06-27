import { PrimaryButton, IButtonProps, getTheme, DefaultButton } from '@fluentui/react';
import React from 'react';

interface Props extends IButtonProps {
    variant?: 'primary' | 'default';
    fullWidth?: boolean;
}

const FluentButton = ({ fullWidth, variant, style, ...props }: Props): JSX.Element => {
    const theme = getTheme();
    const customCSS: React.CSSProperties = { borderRadius: '5px', boxShadow: theme.effects.elevation8, ...style };
    customCSS.width = fullWidth ? '100%' : undefined;

    switch (variant) {
        case 'primary':
            return <PrimaryButton {...props} style={customCSS} />;

        default:
            return <DefaultButton {...props} style={{ border: 0, ...customCSS }} />;
    }
};

export default FluentButton;
