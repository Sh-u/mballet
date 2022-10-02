
const createPost = async (post: FormData): Promise<Response> => {

  return fetch('http://127.0.0.1:7878/posts', {

    method: 'POST',
    body: post,
    // headers: {
    //   'Content-Type': 'multipart/form-data'
    // }
  });
}

export default createPost
