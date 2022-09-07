
interface ResetProps {
    email: string
}

const reset = async (props: ResetProps): Promise<Response> => {

    return fetch("http://127.0.0.1:7878/reset", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(props)
    })
}

export default reset