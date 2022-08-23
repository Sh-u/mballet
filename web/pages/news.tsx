import { InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import CreatePostForm from '../components/CreatePost';
import DeleteModal from '../components/DeletePostModal';
import { DropdownProps, Post, Posts } from '../types';
import UpdatePostRequest from '../utils/UpdatePostRequest';
import { PlusCircleIcon, DotsHorizontalIcon } from '@heroicons/react/solid'
import { useEffect, useState } from 'react';
import PostDropdown from '../components/PostDropdown';
import EditPostModal from '../components/EditPostModal';
import { Button, Center, Group, Modal, Stack, Title } from '@mantine/core';

interface UpdateIconProps {
    postId: number,
    newPost: Post,
    refreshData: () => void
}


const UpdateIcon = ({ postId, newPost, refreshData }: UpdateIconProps) => {


    const handleUpdatingPost = async () => {

        if (((await UpdatePostRequest(postId, newPost)).status !== 200)) {
            console.log('updating post error');
            return;
        }

        refreshData();
    }

    return (
        <div onClick={() => handleUpdatingPost()} className='absolute bottom-0 right-0 p-1'>
            U
        </div>
    )
}



const News = ({ posts }: InferGetStaticPropsType<typeof getStaticProps>) => {

    console.log("Rendering: {News page}");

    const router = useRouter();
    const refreshData = () => {
        console.log("refreshing");
        router.replace(router.asPath);
    }
    const [opened, setOpened] = useState(false);

    const clicker = (event: any) => {
        console.log('Clicked Item : ', event.currentTarget);
    }

    return (
        <>



            {posts.length < 1 ? (<Center style={{ marginTop: 10 }}  ><Title order={1}>There is nothing interesting here yet...</Title></Center>) : null}


            <CreatePostForm refreshData={refreshData} />


            <Stack align={'center'} mt='lg'>
                {posts.map((post, key) => (
                    <div className='mt-2 w-1/3 bg-gray-500  relative' key={key}>

                        <PostDropdown />
                        <div className='flex justify-center items-center  bg-gray-600'>
                            <div className='p-5  text-3xl font-semibold'>{post.body}</div>
                        </div>

                        <div className='flex flex-col p-2'>
                            <div className=''>x days ago at X PM</div>
                            <div className=' text-5xl'>{post.title}</div>
                            <div className='  text-xl font-extralight'>Random description</div>

                        </div>

                        <EditPostModal postId={post.id} refreshData={refreshData} post={post} />
                        <DeleteModal postId={post.id} refreshData={refreshData} />

                    </div>
                ))}
            </Stack>

        </>
    )
}



export const getStaticProps = async () => {


    let fetchPosts = async () => {
        const response = await fetch('http://127.0.0.1:7878/posts', { method: 'GET', mode: 'cors', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } });

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


export default News;