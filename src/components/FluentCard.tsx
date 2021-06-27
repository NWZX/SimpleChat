import React from 'react';
import { Card, ICardProps } from '@uifabric/react-cards';
import { useTheme } from '@fluentui/react';

export interface FluentCardProps extends ICardProps {}

export const FluentCard = (props: FluentCardProps): JSX.Element => {
    const theme = useTheme();
    const customCSS: React.CSSProperties = {
        borderRadius: '10px',
        background: theme.palette.neutralLighterAlt,
        ...props.style,
    };
    return <Card {...props} style={customCSS}></Card>;
};
