import { Post } from "../types";


const UpdatePostRequest = async (postId: number, post: Post): Promise<Response> => {


    return fetch(`http://127.0.0.1:7878/posts/${postId}`, {

        method: 'PUT',
        body: JSON.stringify(post),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export default UpdatePostRequest
