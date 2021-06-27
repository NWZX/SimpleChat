import React from 'react';
import { TextField, ITextFieldProps, useTheme } from '@fluentui/react';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';

interface Props<T> extends UseControllerProps<T> {
    innerProps?: ITextFieldProps & { fullWidth?: boolean };
    showError?: boolean;
}

const ControlTextField = <T extends FieldValues>({
    name,
    control,
    defaultValue,
    rules,
    shouldUnregister,
    innerProps,
    showError = true,
}: Props<T>): JSX.Element => {
    const theme = useTheme();
    const customCSS: React.CSSProperties = {
        borderRadius: '5px',

        ...innerProps?.style,
    };
    customCSS.width = innerProps?.fullWidth ? '100%' : undefined;
    const { field, fieldState } = useController({ name, control, defaultValue, rules, shouldUnregister });

    return (
        <TextField
            {...innerProps}
            styles={{
                fieldGroup: {
                    background: theme.palette.neutralLighter,
                    borderRadius: '5px',
                    selectors: {
                        '::after': {
                            borderRadius: '5px',
                        },
                    },
                },
                field: {
                    boxShadow: theme.effects.elevation4,
                    transition: 'box-shadow 300ms',
                    selectors: {
                        ':focus': {
                            boxShadow: theme.effects.elevation16,
                        },
                    },
                },
            }}
            borderless={true}
            style={customCSS}
            onChange={(_, v) => field.onChange(v)}
            onBlur={() => field.onBlur()}
            elementRef={field.ref}
            name={field.name}
            errorMessage={showError ? fieldState.error?.message : undefined}
            value={field.value as string}
        />
    );
};

export default ControlTextField;
