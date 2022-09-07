import { Button, Center, Group, Loader, Modal, Stack } from '@mantine/core';
import { InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CreatePostForm from '../components/CreatePost';
import DeleteModal from '../components/DeletePostModal';
import { Posts } from '../types';

import { Text } from '@mantine/core'
import me from '../utils/me';
import logout from '../utils/logout';




const Home = () => {

  const [logged, setLogged] = useState(false);
  const router = useRouter();
  const refreshData = () => {
    console.log("refreshing");
    router.replace(router.asPath);
  }
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const checkMe = async () => {
      const response = await me();

      if (response.status !== 200) {

      } else {
        setLogged(true)

      }

    }

    checkMe().catch(console.error)
    setLoading(false)
  }, [])

  const handleLogout = async () => {
    await logout();
    refreshData();
    console.log('logout')
  }

  if (isLoading) return (
    <Center mt={'lg'}>
      <Loader size={'lg'}></Loader>
    </Center>

  )

  return (
    <>
      <Center mt={'lg'}>
        {logged ?
          <Stack>
            <Text size='xl'>LOGGED IN</Text>
            <Button onClick={handleLogout}>Logout</Button>
          </Stack> :
          <Text size='xl'>NOT LOGGED IN</Text>
        }
      </Center>
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