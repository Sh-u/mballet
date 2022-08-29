import {
    Anchor, Button,
    Divider, Group, Paper, PaperProps, PasswordInput, Stack, Text, TextInput
} from '@mantine/core';
import { upperFirst, useToggle } from '@mantine/hooks';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FacebookButton, GoogleButton } from '../components/SocialButtons';
import { Credentials } from '../types';
import RegisterRequest from '../utils/RegisterRequest';
import sendMail from '../utils/sendMail';


const validate = (values: Credentials) => {
    const errors: Record<string, string> = {};

    if (!values.email) {
        errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }

    if (!values.username) {
        errors.username = 'Required';
    } else if (values.username.length < 3) {
        errors.username = 'Username should include at least 3 characters';
    }

    if (!values.password) {
        errors.password = 'Required';
    } else if (values.password.length < 6) {
        errors.password = 'Password should include at least 6 characters';
    }

    return errors;
};

export const AuthenticationForm = (props: PaperProps) => {
    const [type, toggle] = useToggle(['login', 'register']);

    const router = useRouter();
    const formik = useFormik({
        initialValues: {
            email: '',
            username: '',
            password: '',
        },
        validate,
        onSubmit: async (values: Credentials) => {
            alert(JSON.stringify(values, null, 2));

            if (type === 'register') {


                if ((await RegisterRequest(values)).status !== 200) {

                    return;
                }

                console.log('register success');
                await sendMail(values.email);

                router.push('/register');

            }

        },
    });
    return (
        <Paper radius="md" p="xl"  >
            <Text size="lg" weight={500}>
                Welcome to Mballet, {type} with
            </Text>


            <Group grow mb="md" mt="md">
                <GoogleButton radius="xl">Google</GoogleButton>
                <FacebookButton radius="xl"><div>Facebook</div></FacebookButton>
            </Group>

            <Divider label="Or continue with email" labelPosition="center" my="lg" />

            <form onSubmit={formik.handleSubmit}>
                <Stack>
                    {type === 'register' && (
                        <TextInput
                            label="Username"
                            id='username'
                            name='username'
                            placeholder="Your username"
                            value={formik.values.username}
                            onChange={formik.handleChange}
                        />
                    )}

                    <TextInput
                        required
                        label="Email"
                        id='email'
                        name='email'
                        placeholder="Your@email.com"
                        value={formik.values.email}
                        onChange={formik.handleChange}

                        error={formik.errors.email}
                    />

                    <PasswordInput
                        required
                        label="Password"
                        id='password'
                        name='password'
                        placeholder="Your password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.errors.password}
                    />


                </Stack>

                <Group position="apart" mt="xl">
                    <Anchor
                        component="button"
                        type="button"
                        color="dimmed"
                        onClick={() => toggle()}
                        size="xs"
                    >
                        {type === 'register'
                            ? 'Already have an account? Login'
                            : "Don't have an account? Register"}
                    </Anchor>
                    <Button type="submit">{upperFirst(type)}</Button>
                </Group>
            </form>
        </Paper>
    );
}