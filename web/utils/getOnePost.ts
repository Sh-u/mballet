
const getOnePost = async (id: string): Promise<Response> => {

    return fetch(`http://127.0.0.1:7878/posts/${id}`, {

        method: 'GET',
    });
}

export default getOnePost
