import {
    Anchor, Button,
    Divider, Group, Loader, Paper, PaperProps, PasswordInput, Stack, Text, TextInput
} from '@mantine/core';
import { upperFirst, useToggle } from '@mantine/hooks';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FacebookButton, GoogleButton } from './SocialButtons';
import { Credentials } from '../types';
import login from '../utils/login';
import RegisterRequest from '../utils/RegisterRequest';
import sendMail from '../utils/sendMail';
import googleInit from '../utils/googleInit';



const validate = (values: Credentials, type: string) => {
    const errors: Record<string, string> = {};

    if (!values.email) {
        errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }

    if (!values.username && type === 'register') {
        errors.username = 'Required';
    } else if (values.username.length < 4 && type === 'register') {
        errors.username = 'Username should include at least 4 characters';
    }

    if (!values.password) {
        errors.password = 'Required';
    } else if (values.password.length < 4) {
        errors.password = 'Password should include at least 4 characters';
    }

    return errors;
};


interface AuthenticationFormProps {
    showConfirmation: () => void,
}

export const AuthenticationForm = (props: AuthenticationFormProps) => {
    const [type, toggle] = useToggle(['login', 'register']);

    const router = useRouter();

    const handleGoogleClick = async () => {
        let response = await googleInit();

        if (response.status !== 200) {
            return;
        }

        let body = await response.json();

        router.push(body.url);
    }

    const formik = useFormik({
        initialValues: {
            email: '',
            username: '',
            password: '',
        },
        validate: (values: Credentials) => validate(values, type),
        onSubmit: async (values: Credentials) => {

            console.log('submit')
            if (type === 'register') {

                let createUserResponse = await RegisterRequest(values);
                if (createUserResponse.status !== 200) {
                    let err = await createUserResponse.json();

                    console.log(err.message.search("email"))
                    if (err.message.search("email") >= 0) {
                        formik.setErrors({
                            email: "Email address already taken."
                        })

                    } else {
                        formik.setErrors({
                            username: "Username already taken."
                        })
                    }

                    return;
                }

                console.log('register success');

                const sendMailResponse = (await sendMail({
                    email: values.email
                }));

                if (sendMailResponse.status !== 200) {
                    console.log('confirmation error');
                    return;
                }


                console.log('register success2');
                props.showConfirmation();
                // router.push(`/register/${confirmation.id}`);

            }
            else {

                console.log('login')

                const loginResponse = await login(values);

                if (loginResponse.status !== 200) {
                    let err = await loginResponse.json();

                    formik.setErrors({
                        email: err.message
                    })

                    return;
                }

                router.push('/');

            }

        },
    });
    return (
        <Paper radius="md" p="xl"  >
            <Text size="lg" weight={500}>
                Welcome to Mballet, {type} with
            </Text>


            <Group position='center' mb="md" mt="md">
                <GoogleButton radius="xl" clickHandler={handleGoogleClick}>Google</GoogleButton>
                {/* <FacebookButton radius="xl"><div>Facebook</div></FacebookButton> */}
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
                            error={formik.errors.username}
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
                    <Stack align={'flex-start'} justify='center'>
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

                        <Anchor component="button"
                            type="button"
                            color="dimmed"
                            size='xs'
                            onClick={() => router.push('/forgotpassword')}>
                            Forgot password?
                        </Anchor>
                    </Stack>

                    {formik.isSubmitting ? <Loader /> : <Button type="submit" onClick={async () => formik.submitForm()}>{upperFirst(type)}</Button>}

                </Group>
            </form>
        </Paper>
    );
}