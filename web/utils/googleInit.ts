
const googleInit = async (): Promise<Response> => {

    return fetch("http://127.0.0.1:7878/authenticate/google_init");
}

export default googleInit