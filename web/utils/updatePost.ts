import { Post } from "../types";


const updatePost = async (postId: number, body: FormData): Promise<Response> => {


    return fetch(`http://127.0.0.1:7878/posts/${postId}`, {

        method: 'PUT',
        body: body,
        credentials: 'include'

    });
}

export default updatePost
