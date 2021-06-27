import { mergeStyleSets } from '@fluentui/react';
import React from 'react';

type TSizings = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

interface IFluentGridProps {
    spacing?: TSizings;
    justify?: 'start' | 'center' | 'end';
    style?: React.CSSProperties;
}

export const FluentGrid: React.FC<IFluentGridProps> = ({ children, spacing = 0, justify, style }) => {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gridGap: `${spacing * 0.5}%`,
                justifyItems: justify,
                ...style,
            }}
        >
            {children}
        </div>
    );
};

interface IFluentGridItemProps {
    xs?: TSizings;
    sm?: TSizings;
    md?: TSizings;
    lg?: TSizings;
    xl?: TSizings;
}

export const FluentGridItem: React.FC<IFluentGridItemProps> = ({ children, ...props }) => {
    const breakpoint: number[] = [];

    for (let i = 0; i < 5; i++) {
        switch (i) {
            case 0:
                breakpoint.push(props.xs ? props.xs : 12);
                break;
            case 1:
                breakpoint.push(props.sm ? props.sm : breakpoint[0]);
                break;
            case 2:
                breakpoint.push(props.md ? props.md : breakpoint[1]);
                break;
            case 3:
                breakpoint.push(props.lg ? props.lg : breakpoint[2]);
                break;
            case 4:
                breakpoint.push(props.xl ? props.xl : breakpoint[3]);
                break;

            default:
                break;
        }
    }

    const classNames = mergeStyleSets({
        fgi: {
            '@media(min-width: 0px) and (max-width: 600px)': {
                gridColumnEnd: `span ${breakpoint[0]}`, //XS
            },
            '@media(min-width: 600px) and (max-width: 960px)': {
                gridColumnEnd: `span ${breakpoint[1]}`, //SM
            },
            '@media(min-width: 960px) and (max-width: 1280px)': {
                gridColumnEnd: `span ${breakpoint[2]}`, //MD
            },
            '@media(min-width: 1280px) and (max-width: 1920px)': {
                gridColumnEnd: `span ${breakpoint[3]}`, //LG
            },
            '@media(min-width: 1920px)': {
                gridColumnEnd: `span ${breakpoint[4]}`, //XL
            },
        },
    });

    return <div className={classNames.fgi}>{children}</div>;
};
