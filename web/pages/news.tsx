import {
  Anchor,
  Box,
  Center,
  Group,
  Image,
  Pagination,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons";
import dayjs from "dayjs";
import { InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import MainContentWrapper from "../components/MainContentWrapper";
import Navbar from "../components/Navbar";
import CreatePost from "../components/News/CreatePost";
import DeletePost from "../components/News/DeletePost";
import EditPost from "../components/News/EditPost";
import useCheckAdmin from "../hooks/useCheckAdmin";
import { Post } from "../types";
import getAllPosts from "../utils/getAllPosts";

const News = ({ posts }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [postIndex, setPostIndex] = useState([0, 5]);
  const [pageIndex, setPageIndex] = useState(1);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);

  const router = useRouter();

  const render = useCheckAdmin();

  const refreshData = () => {
    console.log("refreshing");
    router.replace(router.asPath);
  };

  const mapPageToPostIndex = (page: number) => {
    if (page === 1) {
      return [0, 5];
    } else {
      return [5 * (page - 1), 5 * (page - 1) + 5];
    }
  };

  useEffect(() => {
    setPostIndex(mapPageToPostIndex(pageIndex));
  }, [pageIndex]);

  const theme = useMantineTheme();

  return (
    <>
      <SimpleGrid
        sx={{
          height: "100%",
          gridTemplateRows: "auto 1fr auto",
        }}
      >
        <Navbar theme={theme} />

        <MainContentWrapper theme={theme}>
          <Stack
            p="10px"
            sx={{
              maxWidth: "70rem",

              marginLeft: "auto",
              marginRight: "auto",

              height: "100%",
              [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
                padding: 0,
              },
            }}
          >
            <Group position="apart">
              <Stack>
                <Title>LATEST NEWS AND EVENTS</Title>
                <Text>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Text>
              </Stack>
              {render ? (
                <CreatePost refreshData={refreshData} theme={theme} />
              ) : null}
            </Group>

            {editModalOpen && currentPost ? (
              <EditPost
                theme={theme}
                post={currentPost}
                refreshData={refreshData}
                editModalOpen={editModalOpen}
                setEditModalOpen={setEditModalOpen}
              />
            ) : null}

            {deleteModalOpen && currentPost ? (
              <DeletePost
                deleteModalOpen={deleteModalOpen}
                setDeleteModalOpen={setDeleteModalOpen}
                postId={currentPost.id}
                refreshData={refreshData}
              />
            ) : null}

            {posts.length > 0 ? (
              posts
                .filter(
                  (_, index) => index >= postIndex[0] && index < postIndex[1]
                )
                .map((p) => (
                  <Group
                    key={p.id}
                    sx={{
                      width: "100%",
                      flexWrap: "wrap",

                      [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
                        flexWrap: "nowrap",
                      },
                    }}
                  >
                    <Image
                      width={"300px"}
                      height="200px"
                      src={
                        p?.img?.split("public/").pop() ??
                        "https://i.imgur.com/bWMapTD.jpg"
                      }
                      alt={p.title}
                    />
                    <Stack
                      sx={{
                        gap: "10px",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                    >
                      <Group sx={{}}>
                        <Title order={3}>{p.title}</Title>
                        {render ? (
                          <Group>
                            <Box
                              onClick={() => {
                                if (deleteModalOpen) return;
                                setCurrentPost(p);
                                setEditModalOpen(true);
                              }}
                              sx={{
                                cursor: "pointer",
                              }}
                            >
                              <IconPencil size={18} />
                            </Box>

                            <Box
                              onClick={() => {
                                if (editModalOpen) return;
                                setCurrentPost(p);
                                setDeleteModalOpen(true);
                              }}
                              sx={{
                                cursor: "pointer",
                              }}
                            >
                              <IconTrash size={18} />
                            </Box>
                          </Group>
                        ) : null}
                      </Group>

                      <Text
                        sx={{
                          maxWidth: "800px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {p.body}
                      </Text>
                      <Text>{dayjs(p.created_at).format("DD/MM/YYYY")}</Text>

                      <Anchor
                        sx={{
                          fontStyle: "italic",
                        }}
                        href={`/news/${p.id}`}
                      >
                        Read More...
                      </Anchor>
                    </Stack>
                  </Group>
                ))
            ) : (
              <>
                <Center
                  sx={{
                    height: "100%",
                  }}
                >
                  <Title>There are no posts created yet...</Title>
                </Center>
              </>
            )}

            <Pagination
              color="dark.6"
              onChange={setPageIndex}
              total={Math.ceil(posts.length / 5) ?? 1}
              withEdges
              initialPage={1}
              sx={{
                justifyContent: "center",
                marginTop: "auto",
              }}
            />
          </Stack>
        </MainContentWrapper>
        <Box
          sx={{
            marginTop: "30px",
          }}
        >
          <Footer theme={theme} />
        </Box>
      </SimpleGrid>
    </>
  );
};

export const getStaticProps = async () => {
  const response = await getAllPosts();

  const posts: Post[] = await response.json();

  return {
    props: {
      posts,
    },

    revalidate: 10,
  };
};

export default News;
