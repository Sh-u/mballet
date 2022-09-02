import { GetConfirmationProps } from "../types"



const confirmReset = async (props: GetConfirmationProps): Promise<Response> => {

    return fetch(`http://127.0.0.1:7878/reset/${props.uuid}`, {
        method: 'POST',
        headers: {
            'Contet-Type': 'application/json'
        },
        body: JSON.stringify(props)
    })

}

export default confirmReset