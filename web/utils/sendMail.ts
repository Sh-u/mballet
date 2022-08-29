



const sendMail = async (email: string): Promise<Response> => {


    return fetch("http://127.0.0.1:7878/register", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(email)
    })
}


export default sendMail