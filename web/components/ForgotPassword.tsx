
import {
    createStyles,
    Paper,
    Title,
    Text,
    TextInput,
    Button,
    Container,
    Group,
    Anchor,
    Center,
    Box,
    Stack,
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons';
import { useRouter } from 'next/router';

const useStyles = createStyles((theme) => ({
    title: {
        fontSize: 26,
        fontWeight: 900,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    },

    controls: {
        [theme.fn.smallerThan('xs')]: {
            flexDirection: 'column-reverse',
        },
    },

    control: {
        [theme.fn.smallerThan('xs')]: {
            width: '100%',
            textAlign: 'center',
        },
    },
}));

export function ForgotPassword() {
    const { classes } = useStyles();
    const router = useRouter();
    return (
        <Container size={400} my={200}>
            <Title className={classes.title} align="center">
                Forgot your password?
            </Title>
            <Text color="dimmed" size="sm" align="center">
                Enter your email to get a reset link
            </Text>

            <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
                <TextInput label="Your email" placeholder="your@email.com" required />
                <Group position="apart" mt="lg" className={classes.controls}>
                    <Anchor color="dimmed" size="sm" className={classes.control}>
                        <Center inline>
                            <IconArrowLeft size={12} stroke={1.5} />
                            <Box ml={5} onClick={() => router.back()}>Back to login page</Box>
                        </Center>
                    </Anchor>
                    <Button className={classes.control}>Reset password</Button>
                </Group>
            </Paper>
        </Container>
    );
}
