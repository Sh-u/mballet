

const deletePost = async (postId: number): Promise<Response> => {


  return fetch(`http://127.0.0.1:7878/posts/${postId}`, {

    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'

  });
}

export default deletePost
