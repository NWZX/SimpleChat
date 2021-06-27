import { Card } from '@uifabric/react-cards';
import { Link, MessageBar, MessageBarType, PrimaryButton, Separator, Stack, Text } from '@fluentui/react';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import firebase from 'firebase/app';
import 'firebase/auth';
import ControlTextField from 'src/components/ControlTextField';

interface Props {
    title: string;
}
type Inputs = {
    email: string;
    password: string;
};

const schema = yup.object().shape({
    email: yup.string().required(),
    password: yup.string().required(),
});

const LoginView = ({ title }: Props): JSX.Element => {
    const navigate = useNavigate();
    const { control, handleSubmit } = useForm<Inputs>({
        resolver: yupResolver(schema), // yup, joi and even your own.
    });
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState('');
    const handleLogin = async (data: Inputs) => {
        try {
            await firebase.auth().signInWithEmailAndPassword(data.email, data.password);
        } catch (error) {
            setError(error.message);
            setHasError(true);
        }
    };

    return (
        <div style={{ minHeight: '100vh' }}>
            <Helmet>
                <title>{title}</title>
                <meta charSet="utf-8" />
                <link rel="canonical" href={window.location.href} />
            </Helmet>
            {hasError && (
                <MessageBar
                    messageBarType={MessageBarType.error}
                    isMultiline={false}
                    dismissButtonAriaLabel="Close"
                    onDismiss={() => {
                        setHasError(false);
                    }}
                >
                    {error}
                </MessageBar>
            )}
            <Stack horizontalAlign="center" verticalAlign="center" style={{ minHeight: 'inherit' }}>
                <Stack.Item>
                    <form onSubmit={handleSubmit(handleLogin)}>
                        <Card tokens={{ childrenMargin: 10, padding: 20, minWidth: 500 }}>
                            <Card.Item align="center">
                                <Text variant="xxLarge">Simple Chat</Text>
                            </Card.Item>
                            <Card.Item>
                                <Separator />
                            </Card.Item>
                            <Card.Item grow>
                                <ControlTextField
                                    name="email"
                                    control={control}
                                    innerProps={{ label: 'Email :', type: 'email', required: true }}
                                />
                            </Card.Item>
                            <Card.Item grow>
                                <ControlTextField
                                    name="password"
                                    control={control}
                                    innerProps={{
                                        label: 'Password :',
                                        type: 'password',
                                        required: true,
                                    }}
                                />
                            </Card.Item>
                            <Card.Item grow>
                                <Text>No account ? </Text>
                                <Text variant="mediumPlus">
                                    <Link
                                        onClick={() => {
                                            navigate('/register');
                                        }}
                                    >
                                        SignUp
                                    </Link>
                                </Text>
                            </Card.Item>
                            <Card.Item align="center">
                                <PrimaryButton type="submit" iconProps={{ iconName: 'Signin' }} text="SignIn" />
                            </Card.Item>
                        </Card>
                    </form>
                </Stack.Item>
            </Stack>
        </div>
    );
};

export default LoginView;
