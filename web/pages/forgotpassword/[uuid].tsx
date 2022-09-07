import { Anchor, Button, Center, Group, Paper, Text } from "@mantine/core"
import { GetServerSideProps } from "next";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ForgotPassword } from "../../components/ForgotPassword";
import confirmCreation from "../../utils/confirmCreation";
import getConfirmation from "../../utils/getConfirmation";


interface RegisterProps {

    uuid: string

}

const ForgotPasswordPage = (context: RegisterProps) => {

    const router = useRouter();

    console.log(context?.uuid)


    return (
        <ForgotPassword type="password" uuid={context?.uuid} />


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

    let response = await getConfirmation({
        uuid: id
    });


    if (response.status !== 200) {
        console.log('no confirmation')
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

export default ForgotPasswordPage