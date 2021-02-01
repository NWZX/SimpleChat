import { PrimaryButton, Separator, Stack, TextField, Text, Link, MessageBar, MessageBarType } from '@fluentui/react';
import { Card } from '@uifabric/react-cards';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import firebase from 'firebase/app';

const alphanum = /^[a-z0-9]+$/i;

interface Props {
    title: string;
}

type Inputs = {
    username: string;
    email: string;
    password: string;
};

const schema = yup.object().shape({
    username: yup
        .string()
        .min(3, 'Username too short')
        .max(20, 'Username too long')
        .matches(alphanum, 'Invalid character')
        .required(),
    email: yup.string().required(),
    password: yup.string().required(),
});

const RegisterView = ({ title }: Props): JSX.Element => {
    const navigate = useNavigate();
    const { control, handleSubmit, errors } = useForm<Inputs>({
        resolver: yupResolver(schema), // yup, joi and even your own.
    });
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState('');
    const handleRegister = async (data: Inputs) => {
        try {
            const auth = await firebase.auth().createUserWithEmailAndPassword(data.email, data.password);
            await firebase.firestore().collection('users').add({
                authId: auth.user?.uid,
                username: data.username,
                contact: [],
                createdAt: firebase.firestore.Timestamp.now(),
                lastActivity: firebase.firestore.Timestamp.now(),
            });
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
                    <form onSubmit={handleSubmit(handleRegister)}>
                        <Card tokens={{ childrenMargin: 10, padding: 20, minWidth: 500 }}>
                            <Card.Item align="center">
                                <Text variant="xxLarge">Simple Chat</Text>
                            </Card.Item>
                            <Card.Item>
                                <Separator />
                            </Card.Item>
                            <Card.Item grow>
                                <Controller
                                    as={TextField}
                                    label="Username :"
                                    name="username"
                                    control={control}
                                    errorMessage={errors.username?.message}
                                    defaultValue=""
                                    required
                                />
                            </Card.Item>
                            <Card.Item grow>
                                <Controller
                                    as={TextField}
                                    label="Email :"
                                    name="email"
                                    control={control}
                                    errorMessage={errors.email?.message}
                                    defaultValue=""
                                    type="email"
                                    required
                                />
                            </Card.Item>
                            <Card.Item grow>
                                <Controller
                                    as={TextField}
                                    label="Password :"
                                    name="password"
                                    control={control}
                                    errorMessage={errors.password?.message}
                                    defaultValue=""
                                    type="password"
                                    canRevealPassword
                                    required
                                />
                            </Card.Item>
                            <Card.Item grow>
                                <Text>Already have a account ? </Text>
                                <Text variant="mediumPlus">
                                    <Link
                                        onClick={() => {
                                            navigate('/login');
                                        }}
                                    >
                                        SignIn
                                    </Link>
                                </Text>
                            </Card.Item>
                            <Card.Item align="center">
                                <PrimaryButton type="submit" iconProps={{ iconName: 'FollowUser' }} text="SignUp" />
                            </Card.Item>
                        </Card>
                    </form>
                </Stack.Item>
            </Stack>
        </div>
    );
};

export default RegisterView;
