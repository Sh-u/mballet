import { Button, Group, Modal } from '@mantine/core';
import { InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import CreatePostForm from '../components/CreatePost';
import DeleteModal from '../components/DeletePostModal';
import { Posts } from '../types';







const Home = () => {
  const [opened, setOpened] = useState(false);

  console.log('render')
  return (
    <>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Introduce yourself!"
      >
        {/* Modal content */}
      </Modal>

      <Group position="center">
        <Button onClick={() => setOpened(true)}>Open Modal</Button>
      </Group>

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