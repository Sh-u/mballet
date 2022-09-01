const me = async (): Promise<Response> => {

    return fetch("http://127.0.0.1:7878/me", {
        credentials: 'include'
    })
}


export default me