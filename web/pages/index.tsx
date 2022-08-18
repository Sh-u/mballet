import type { GetStaticProps, NextPage } from 'next'
import { useEffect } from 'react';
import { InferGetStaticPropsType } from 'next'

type Posts = {
  id: number;
  title: string;
  body: string;
  published: boolean;
}


 const Home = ({posts}: InferGetStaticPropsType<typeof getStaticProps>) => {

 
  return (
    <div className='w-full'>
    <div className='flex flex-col  justify-center items-center  mt-10 ' >

     {posts.map((post) => (
      <div className='mt-2 bg-gray-500 p-2'>
        <div className=' text-5xl'>{post.title}</div>
        <div className=' text-3xl'>{post.body}</div>
        </div>
      ))}


      <div className='mt-10'>
        <text className='text-2xl cursor-pointer'>create post</text>
      </div>

    </div>
    </div>
  )
}



export const getStaticProps = async () => {


  let fetchPosts = async () => {
    const response = await fetch('http://127.0.0.1:7878/posts', { method: 'GET', mode: 'cors', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json'}});

    const posts: Array<Posts> = await response.json();

    console.log(posts)
    return posts;
  }
 
  const posts = await fetchPosts();


  return {
    props: {
      posts,
    },

    revalidate: 10, 
  }
}


export default Home;