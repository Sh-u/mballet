import { GetConfirmationProps } from "../types"

const getConfirmation = async (props: GetConfirmationProps): Promise<Response> => {

    return fetch(`http://127.0.0.1:7878/register/${props.uuid}`, {
        headers: {
            'Content-Type': 'application/json'
        },
    })
}


export default getConfirmation