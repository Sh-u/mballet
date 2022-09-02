

const logout = async (): Promise<Response> => {

    return fetch("http://127.0.0.1:7878/logout", {
        method: 'POST',
        credentials: 'include'

    })
}


export default logout