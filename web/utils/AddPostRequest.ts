import { Post } from "../types";

const AddPostRequest = async (post: Post): Promise<Response> => {

    console.log('addpost', JSON.stringify(post));
  
    return fetch('http://127.0.0.1:7878/posts', {
  
      method: 'POST',
      body: JSON.stringify(post),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  export default AddPostRequest
  