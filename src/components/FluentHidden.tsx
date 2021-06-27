import { mergeStyleSets } from '@fluentui/react';
import React from 'react';

interface Props {
    xs?: boolean;
    sm?: boolean;
    md?: boolean;
    lg?: boolean;
    xl?: boolean;
}

const FluentHidden: React.FC<Props> = ({ xs, sm, md, lg, xl, children }) => {
    const classNames = mergeStyleSets({
        fluentHidden: {
            '@media(min-width: 0px) and (max-width: 600px)': {
                display: `${xs ? 'none' : 'block'}`, //XS
            },
            '@media(min-width: 600px) and (max-width: 960px)': {
                display: `${sm ? 'none' : 'block'}`, //SM
            },
            '@media(min-width: 960px) and (max-width: 1280px)': {
                display: `${md ? 'none' : 'block'}`, //MD
            },
            '@media(min-width: 1280px) and (max-width: 1920px)': {
                display: `${lg ? 'none' : 'block'}`, //LG
            },
            '@media(min-width: 1920px)': {
                display: `${xl ? 'none' : 'block'}`, //XL
            },
        },
    });
    return <div className={classNames.fluentHidden}>{children}</div>;
};

export default FluentHidden;
