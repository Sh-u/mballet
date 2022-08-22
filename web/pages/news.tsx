import { InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import CreatePostForm from '../components/CreatePostForm';
import DeleteModal from '../components/DeleteModal';
import { DropdownProps, Post, Posts } from '../types';
import UpdatePostRequest from '../utils/UpdatePostRequest';
import { PlusCircleIcon, DotsHorizontalIcon } from '@heroicons/react/solid'
import { useEffect, useState } from 'react';
import PostDropdown from '../components/PostDropdown';
import EditPostModal from '../components/EditPostModal';
import { Button, Group, Modal } from '@mantine/core';

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


export enum CreatePostState {
    None,
    Create,
    Edit,
    Delete
}

const News = ({ posts }: InferGetStaticPropsType<typeof getStaticProps>) => {

    const [createPostState, setCreatePostState] = useState(CreatePostState.None);

    const router = useRouter();
    const refreshData = () => {
        console.log("refreshing");
        router.replace(router.asPath);
    }
    const [opened, setOpened] = useState(false);

    useEffect(() => {
        console.log(createPostState.toString())
    }, [createPostState])
    const handleCreatePostState = (CreatePostState: CreatePostState) => {

        setCreatePostState(CreatePostState)
    }

    const handleResetCreatePostState = () => {

        setCreatePostState(CreatePostState.None)
    }

    const showModal = ({ postId, refreshData, handleResetCreatePostState, post }: DropdownProps) => {
        switch (createPostState) {

            case CreatePostState.Create: {
                return <CreatePostForm refreshData={refreshData} type={CreatePostState.Create} />;
            }
            case CreatePostState.Edit: {
                return <EditPostModal handleResetCreatePostState={handleResetCreatePostState} postId={postId} post={post} refreshData={refreshData} />;
            }
            case CreatePostState.Delete: {
                return <DeleteModal handleResetCreatePostState={handleResetCreatePostState} postId={postId} refreshData={refreshData} />;
            }
            default: {
                return null;
            }

        }
    }


    return (
        <>

            {posts.length < 1 ? (<div className='flex items-center justify-center mt-10 text-2xl '>There is nothing interesting here yet...</div>) : null}

            <div className='w-screen h-screen overflow-x-hidden' >
                <div className='flex flex-col  justify-center items-center  mt-10 ' >

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


                            <EditPostModal handleResetCreatePostState={handleResetCreatePostState} postId={post.id} refreshData={refreshData} post={post} />
                            <DeleteModal handleResetCreatePostState={handleResetCreatePostState} postId={post.id} refreshData={refreshData} />

                            {/* {showModal({
                                handleResetCreatePostState: handleResetCreatePostState,
                                refreshData: refreshData,
                                postId: post.id,
                                post: post
                            })} */}

                        </div>
                    ))}


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


                    {/* {<CreatePostForm refreshData={refreshData} />}  */}
                    <PlusCircleIcon className='w-10 h-10 text-gray-500 cursor-pointer' onClick={() => setCreatePostState(CreatePostState.Create)} />
                </div>
            </div >
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