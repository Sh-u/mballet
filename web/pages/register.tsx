import { Anchor, Button, Center, Group, Paper, Text } from "@mantine/core"
import Link from 'next/link';
import { useRouter } from 'next/router';


const Register = () => {

    const router = useRouter();


    return (
        <Center sx={{
            width: '100vw',
            height: '100vh'
        }}>
            <Paper radius="md" p="xl">
                <Text size='xl'>A confirmation link has been sent to your email address.</Text>


                <Group position="apart" mb="md" mt="md">
                    <Anchor component="button"
                        type="button"
                        color="dimmed"
                        size='xs'>
                        Mail missing? Send Again.
                    </Anchor>
                    <Link href="/">
                        <Button color='cyan' >Back to home page</Button>
                    </Link>


                </Group>

            </Paper>
        </Center>


    )
}


export default Register