import { Button, Group, Modal } from '@mantine/core';
import { InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CreatePostForm from '../components/CreatePost';
import DeleteModal from '../components/DeletePostModal';
import { Posts } from '../types';

import { Text } from '@mantine/core'
import me from '../utils/me';




const Home = () => {

  const [logged, setLogged] = useState(false);

  useEffect(() => {
    const checkMe = async () => {
      const response = await me();

      if (response.status !== 200) {

      } else {
        setLogged(true)
      }

    }

    checkMe().catch(console.error)

  }, [])

  console.log('render')
  return (
    <>
      {logged ? <Text size='xl'>LOGGED IN</Text> : <Text size='xl'>NOT LOGGED IN</Text>}
    </>
  )
}



// export const getStaticProps = async () => {


//   let fetchPosts = async () => {
//     const response = await fetch('http://127.0.0.1:7878/posts', { method: 'GET', mode: 'cors', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } });

//     const posts: Array<Posts> = await response.json();

//     console.log(posts)
//     return posts;
//   }

//   const posts = await fetchPosts();


//   return {
//     props: {
//       posts,
//     },

//     revalidate: 10,
//   }
// }


export default Home;