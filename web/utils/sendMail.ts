

interface SendMailProps {
    email: string;
}

const sendMail = async (props

    : SendMailProps): Promise<Response> => {


    return fetch("http://127.0.0.1:7878/register", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(props)
    })
}


export default sendMail