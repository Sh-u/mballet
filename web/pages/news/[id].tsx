import { Anchor, Button, Center, Group, Paper, Stack, Text, Title, Image } from "@mantine/core"
import { GetServerSideProps } from "next";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ForgotPassword } from "../../components/ForgotPassword";
import { Posts } from "../../types";
import confirmCreation from "../../utils/confirmCreation";
import { defaultNewsImage } from "../../utils/defaultNewsImage";
import getConfirmation from "../../utils/getConfirmation";
import getOnePost from "../../utils/getOnePost";





const FullPostPage = (props: Posts) => {

    const router = useRouter();

    console.log(props)


    return (
        <>
            <Stack sx={{
                maxWidth: '70rem',
                margin: '30px auto auto auto'
            }}>
                <Button onClick={() => router.back()} sx={{
                    width: 'fit-content'
                }}>Back</Button>
                <Title sx={{
                    textAlign: 'center'
                }}>{props.title}</Title>
                <Image width={'70rem'} height={'40rem'} src={props.img ? `/${props.img.split("public/").pop()}` : defaultNewsImage} />
                <Text>{props.body}</Text>
            </Stack>
        </>


    )
}


export const getServerSideProps: GetServerSideProps = async (context) => {


    let id = context?.query?.id as string;

    console.log('id:', id)
    if (!id) {
        return {
            notFound: true
        }
    }

    let response = await getOnePost(id);


    if (response.status !== 200) {
        console.log('no confirmation')
        return {
            notFound: true
        }
    }

    const props = await response.json();

    return {
        props: props
    }
}

export default FullPostPage