const getAllPosts = async (): Promise<Response> => {
    return fetch('http://127.0.0.1:7878/posts', { method: 'GET', mode: 'cors', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } });
}

export default getAllPosts