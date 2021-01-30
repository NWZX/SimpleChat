import { Card } from '@uifabric/react-cards';
import { Link, PrimaryButton, Separator, Stack, Text, TextField } from '@fluentui/react';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

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
    return (
        <>
            <Helmet>
                <title>{title}</title>
                <meta charSet="utf-8" />
                <link rel="canonical" href={window.location.href} />
            </Helmet>
            <Stack horizontalAlign="center" verticalAlign="center" style={{ minHeight: 'inherit' }}>
                <Stack.Item>
                    <form onSubmit={handleSubmit((d) => console.log(d))}>
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
                                    label="Email :"
                                    name="email"
                                    control={control}
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
                                    defaultValue=""
                                    type="password"
                                    canRevealPassword
                                    required
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
        </>
    );
};

export default LoginView;
