import { Anchor, Button, Center, Group, Paper, Text } from "@mantine/core"
import { GetServerSideProps } from "next";
import Link from 'next/link';
import { useRouter } from 'next/router';
import confirmCreation from "../../utils/confirmCreation";
import getConfirmation from "../../utils/getConfirmation";


interface RegisterProps {
    props: {
        uuid: string
    }
}

const Register = (context: RegisterProps) => {

    const router = useRouter();

    console.log(context?.props?.uuid)


    return (
        <Center sx={{
            width: '100vw',
            height: '100vh'
        }}>
            <Paper radius="md" p="xl">
                <Text size='xl'>Thank you for verificating your account.</Text>

                <Group position="center" mb="md" mt="md">

                    <Link href="/">
                        <Button >Back to home page</Button>
                    </Link>


                </Group>

            </Paper>
        </Center>


    )
}


export const getServerSideProps: GetServerSideProps = async (context) => {


    let id = context?.query?.uuid as string;
    id.trimStart();
    console.log('id:', id)
    if (!id) {
        return {
            notFound: true
        }
    }

    let confirmation = await getConfirmation({
        uuid: id
    });
    console.log('c: ', confirmation.status)

    if (confirmation.status !== 200) {
        return {
            notFound: true
        }
    }

    let confirm_creation = await confirmCreation({
        uuid: id
    });

    console.log('c_c: ', confirm_creation.status)
    if (confirm_creation.status !== 200) {
        return {
            notFound: true
        }
    }



    return {
        props: {
            uuid: id
        },
    }
}

export default Register