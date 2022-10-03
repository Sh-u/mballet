import { InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import CreatePostForm from '../components/CreatePostForm';
import DeleteModal from '../components/DeletePostModal';
import { DropdownProps, Post, Posts } from '../types';
import updatePost from '../utils/updatePost';
import { PlusCircleIcon, DotsHorizontalIcon } from '@heroicons/react/solid'
import { useEffect, useState } from 'react';
import PostDropdown from '../components/PostDropdown';
import EditPostModal from '../components/EditPostModal';
import { Button, Center, Group, Modal, SimpleGrid, Stack, Title, Text, useMantineTheme, Skeleton, Box, Image, Anchor, Pagination } from '@mantine/core';
import NewsCardPreview from '../components/NewsCardPreview';
import Navbar from '../components/Navbar';
import dayjs from "dayjs";
import Footer from '../components/Footer';
import { IconPencil, IconTrash } from '@tabler/icons';
import deletePost from '../utils/deletePost';
import { useRecoilState } from 'recoil';
import { editModalAtom } from '../atoms/editModalAtom';
import useCheckAdmin from '../hooks/useCheckAdmin';
interface UpdateIconProps {
    postId: number,
    newPost: Post,
    refreshData: () => void
}


const News = ({ posts }: InferGetStaticPropsType<typeof getStaticProps>) => {




    const [postIndex, setPostIndex] = useState([0, 5]);
    const [pageIndex, setPageIndex] = useState(1);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [currentPost, setCurrentPost] = useState<Posts | null>(null);

    const router = useRouter();


    const render = useCheckAdmin();

    const refreshData = () => {
        console.log("refreshing");
        router.replace(router.asPath);
    }

    const mapPageToPostIndex = (page: number) => {
        if (page === 1) {
            return [0, 5]
        } else {
            return [(5 * (page - 1)), (5 * (page - 1)) + 5]
        }
    }

    useEffect(() => {
        setPostIndex(mapPageToPostIndex(pageIndex))
    }, [pageIndex])

    const theme = useMantineTheme();

    const handleDeletePost = async (id: number) => {
        const response = await deletePost(id);

        if (response.status !== 200) {
            return;
        }

        refreshData();
    }

    return (
        <>

            {/* <Navbar theme={theme} /> */}

            {(
                <Group position='apart' sx={{
                    maxWidth: '70rem',
                    marginTop: '20px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    padding: '10px',
                    [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
                        padding: 0,
                    },
                }}>
                    <Stack>
                        <Title >LATEST NEWS AND EVENTS</Title>
                        <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Text>
                    </Stack>
                    {render ? <CreatePostForm refreshData={refreshData} theme={theme} /> : null}

                </Group>

            )
            }

            {editModalOpen && currentPost ? <EditPostModal theme={theme} post={currentPost} refreshData={refreshData} editModalOpen={editModalOpen} setEditModalOpen={setEditModalOpen} /> : null}
            <Group mt='20px' sx={{
                maxWidth: '70rem',
                margin: 'auto',

                padding: '10px',
                [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
                    padding: 0,
                    flexWrap: 'wrap',
                },
            }}>
                {posts.length > 0 ? posts.filter((_, index) => index >= postIndex[0] && index < postIndex[1]).map((p) => (

                    <Stack key={p.id} sx={{
                        width: '100%'
                    }}>
                        <Group>
                            <Image width={'300px'} height='200px' src={p?.img?.split("public/").pop() ?? 'https://i.imgur.com/bWMapTD.jpg'} alt={p.title} sx={{



                            }} />
                            <Stack sx={{
                                gap: '10px'
                            }}>
                                <Group>
                                    <Title order={3}>{p.title}</Title>
                                    {render ? (<Group>
                                        <Box onClick={() => {
                                            setCurrentPost(p)
                                            setEditModalOpen(true)
                                        }} sx={{
                                            cursor: 'pointer'
                                        }}>
                                            <IconPencil size={18} />
                                        </Box>

                                        <Box onClick={() => handleDeletePost(p.id)} sx={{
                                            cursor: 'pointer'
                                        }}>
                                            <IconTrash size={18} />
                                        </Box>

                                    </Group>) : null}


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

            <Pagination color='dark.6' onChange={setPageIndex} total={Math.ceil(posts.length / 5) ?? 1} withEdges initialPage={1} sx={{
                justifyContent: 'center',
                margin: '20px auto'
            }} />
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