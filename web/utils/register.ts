import { Credentials } from "../types"




const register = async (credentials: Credentials): Promise<Response> => {

    return fetch("http://127.0.0.1:7878/users", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials),
    })

}


export default register