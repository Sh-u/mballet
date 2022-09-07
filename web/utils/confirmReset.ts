import { ConfirmResetInput, GetConfirmationProps } from "../types"



const confirmReset = async (props: GetConfirmationProps, input: ConfirmResetInput): Promise<Response> => {

    return fetch(`http://127.0.0.1:7878/reset/${props.uuid}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(input),
        credentials: 'include'
    })

}

export default confirmReset