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
import { Button, Center, Group, Modal, SimpleGrid, Stack, Title, Text, useMantineTheme, Skeleton, Box, Image, Anchor } from '@mantine/core';
import NewsCardPreview from '../components/NewsCardPreview';
import Navbar from '../components/Navbar';
import dayjs from "dayjs";
import Footer from '../components/Footer';
import { IconPencil, IconTrash } from '@tabler/icons';
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
    const theme = useMantineTheme();
    const clicker = (event: any) => {
        console.log('Clicked Item : ', event.currentTarget);
    }

    const [open, setOpen] = useState(false);


    return (
        <>

            {/* <Navbar theme={theme} /> */}

            {(
                <Group position='apart' sx={{
                    maxWidth: '70rem',
                    marginTop: '20px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}>
                    <Stack>
                        <Title >LATEST NEWS AND EVENTS</Title>
                        <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Text>
                    </Stack>
                    <CreatePostForm refreshData={refreshData} theme={theme} />
                </Group>

            )}

            <Group mt='20px' sx={{
                maxWidth: '70rem',
                margin: 'auto',
                flexWrap: 'wrap'
            }}>
                {posts.length > 0 ? posts.map((p) => (

                    <Stack sx={{
                        width: '100%'
                    }}>
                        <Group>
                            <Image width={260} height={160} src={p?.img?.split("public/").pop() ?? 'https://i.imgur.com/bWMapTD.jpg'} alt='xddd' />
                            <Stack sx={{
                                gap: '10px'
                            }}>
                                <Group>
                                    <Title order={3}>{p.title}</Title>
                                    <IconPencil size={16} />
                                    <IconTrash size={16} />

                                </Group>

                                <Text>{p.body}</Text>
                                <Text >{dayjs(p.created_at).format('DD/MM/YYYY')}</Text>

                                <Anchor href={`/news/${p.id}`}>Read More</Anchor>
                            </Stack>
                        </Group>
                    </Stack>


                )) : (
                    <>

                        <Center sx={{
                            height: '100%'
                        }}>
                            <Title>There are no posts created yet...</Title>
                        </Center>

                    </>
                )}

            </Group>
            <Box mt='30px' sx={{
                backgroundColor: theme.colors.gray[1]
            }}>
                <Footer theme={theme} />
            </Box>

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