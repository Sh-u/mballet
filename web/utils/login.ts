import { Credentials } from "../types"

const login = async (credentials: Credentials): Promise<Response> => {

    return fetch("http://127.0.0.1:7878/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials),

        credentials: 'include'
    })
}

export default login