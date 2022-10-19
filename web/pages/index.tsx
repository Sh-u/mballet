import "@fontsource/dancing-script";
import {
  ActionIcon,
  BackgroundImage,
  Box,
  Button,
  Center,
  Group,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCertificate,
  IconThumbUp,
  IconUserCheck,
} from "@tabler/icons";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AboutUs from "../components/AboutUs";
import Footer from "../components/Footer";
import LessonCard from "../components/LessonCard";
import Navbar from "../components/Navbar";
import NewsCardPreview from "../components/NewsCardPreview";
import TestimonialCard from "../components/TestimonialCard";
import { Posts } from "../types";
import getAllPosts from "../utils/getAllPosts";

const Home = () => {
  const [isLoading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Posts[]>([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const theme = useMantineTheme();

  const router = useRouter();
  useEffect(() => {
    AOS.init({
      easing: "ease-in-out",
      once: true,
      duration: 700,
    });
  }, []);

  useEffect(() => {
    const getPosts = async () => {
      const response = await getAllPosts();

      if (response.status !== 200) {
        return;
      }

      const posts: Posts[] = await response.json();

      setPosts(posts.slice(0, 3));
    };

    getPosts().catch(console.error);
  }, []);

  const testimonials = [
    <TestimonialCard
      key={"Caroline"}
      theme={theme}
      name={"Caroline"}
      description={"Senior Student"}
      body={`Miriam is a warm-hearted, engaging, passionate and exemplary ballet teacher and dancer. I consider myself incredibly lucky to have Miriam as my teacher.
  I am 69 years old and have become, through her classes, strong in leg, supple in spine, flexible in mind, have transformed my posture and shed unwanted weight. In essence a younger body is revealed.
  Miriam's training, rooted in the Russian lineage, shows a close attention to artistic and technical details, all conveyed at an extremely  high level, accompanied by very carefully chosen appropriate music.
  There is no 'dumbing down' for the public here.  Miriam, mindful by our pace of learning and our individual physical needs, nevertheless ensures a rich and powering personal sense of achievement.
  Finally, I find it very exciting to see, over time, how we can aspire to become closer to the elegance and strength of a vocational ballet dancer.`}
      visible={"flex"}
      position={0}
    />,
    <TestimonialCard
      key={"Baxter"}
      theme={theme}
      name={"Pam Baxter"}
      description={"Student"}
      body={`I have known Miriam for over three and a half years when she first became my ballet teacher. From the very first lesson, I found her to be an extremely friendly person as well as a very thorough teacher.
  Although I was little more than a beginner, she took my tuition very seriously and strove to get the very best out of me. Therefore, the lessons have always been most enjoyable and I’ve been able to progress to an intermediate level fairly easily. I’ve had private lessons from her in small groups as well as larger groups in workshops and on Zoom.
  Our groups have enjoyed sharing their knowledge of ballet by watching various YouTube links that Miriam has selected and sometimes taken part in ballet quizzes that Miriam has organised for us.
  Miriam is also a very caring person and on many occasions, she has given me very helpful advice about nutrition and natural remedies for minor ailments. She is extremely knowledgeable about the dancer’s body and I trust her judgement implicitly.
  To sum up, I feel really  lucky to have found Miriam. She is the most conscientious of teachers and is truely one of life’s “good people`}
      visible={"flex"}
      position={0}
    />,
  ];

  if (isLoading)
    return (
      <Center mt={"lg"}>
        <Loader size={"lg"}></Loader>
      </Center>
    );

  return (
    <>
      <SimpleGrid
        id="home"
        data-aos="fade"
        sx={{
          gridTemplateRows: "auto 1fr auto",
          minHeight: "100%",
        }}
      >
        <Navbar theme={theme} />

        <BackgroundImage
          src="https://i.imgur.com/4djScCf.jpg"
          sx={{
            height: "50%",
            width: "100%",
            opacity: 0.2,
            position: "absolute",

            gridColumn: "1 /  span 3",
            pointerEvents: "none",

            [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
              minHeight: "100%",
            },
            [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
              minHeight: "100%",
            },
          }}
        />

        <Stack
          sx={{
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Title
            sx={{
              opacity: 1,
              fontSize: "70px",
              color: theme.colors.dark[6],
              [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
                fontSize: "120px",
                marginTop: "auto",
              },
              [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
                fontSize: "160px",
                marginTop: "unset",
              },
            }}
          >
            MBALLET
          </Title>
          <Button
            rightIcon={<IconArrowRight size={14} />}
            radius={"xs"}
            styles={{
              root: {
                backgroundColor: theme.colors.dark[6],
                color: "white",
              },
            }}
            sx={{
              fontSize: "14px",
              fontFamily: "Roboto, sans-serif",
              fontWeight: "normal",

              "&:hover": {
                border: "2px black solid",
                transition: "0.2s ease-in-out",
                backgroundColor: "unset",
                color: "black",
              },
            }}
          >
            Learn More
          </Button>

          <Group
            sx={{
              backgroundColor: "rgba(150,150,150, 0.2)",
              justifyContent: "center",
              color: theme.colors.gray[9],
              maxWidth: "80%",
              margin: "auto",
              padding: "10px",
              position: "relative",
              bottom: "-20px",

              [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
                padding: "50px",
                maxWidth: "70rem",
                position: "absolute",
                bottom: "-30px",
              },

              [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
                bottom: "0",
                margin: "0",
                marginTop: "auto",
              },
            }}
          >
            <Stack
              align={"center"}
              sx={{
                justifyContent: "center",
                display: "block",
                maxWidth: "70%",

                [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
                  textAlign: "center",
                  maxWidth: "100%",
                },

                [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
                  maxWidth: "30%",
                  textAlign: "unset",
                },
              }}
            >
              <Title
                sx={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  letterSpacing: "1px",
                }}
              >
                {" "}
                BALLET SCHOOL & STUDIO
              </Title>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
                tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.{" "}
              </Text>
            </Stack>

            <Stack align={"center"}>
              <IconCertificate />
              <Title
                sx={{
                  fontSize: "24px",
                }}
              >
                {" "}
                PROFESSIONAL
              </Title>
              <Text>Lorem ipsum something</Text>
            </Stack>

            <Stack align={"center"}>
              <IconUserCheck />
              <Title
                sx={{
                  fontSize: "24px",
                }}
              >
                {" "}
                EXPERIENCED
              </Title>
              <Text>Lorem ipsum something</Text>
            </Stack>

            <Stack align={"center"}>
              <IconThumbUp />
              <Title
                sx={{
                  fontSize: "24px",
                }}
              >
                BEGINNER FRIENDLY
              </Title>
              <Text>Lorem ipsum something</Text>
            </Stack>
          </Group>
        </Stack>
      </SimpleGrid>

      <AboutUs theme={theme} />

      <Box
        data-aos="fade"
        sx={{
          backgroundColor: theme.colors.gray[0],
        }}
      >
        <Stack
          sx={{
            paddingTop: "20px",
            paddingBottom: "20px",
            maxWidth: "70rem",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "20px",
          }}
        >
          <Group
            sx={{
              flexWrap: "wrap",
              flexDirection: "column",
              [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
                flexDirection: "row",
                justifyContent: "space-between",
                padding: "20px",
              },
              [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
                padding: 0,
              },
            }}
          >
            <Title
              sx={{
                textAlign: "center",
                [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
                  textAlign: "unset",
                },
              }}
            >
              News
            </Title>
            <Text
              sx={{
                textAlign: "center",
                [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
                  textAlign: "unset",
                },
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
              tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
            </Text>

            <Link href="/news">
              <Button component="a" rightIcon={<IconArrowRight size={14} />}>
                Learn more
              </Button>
            </Link>
          </Group>

          <Group
            sx={{
              flexWrap: "wrap",
              justifyContent: "center",
              [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
                flexWrap: "nowrap",
                justifyContent: "unset",
              },
            }}
          >
            {posts.map((post) => (
              <NewsCardPreview
                id={post.id}
                title={post.title}
                body={post.body}
                date={post.created_at}
                image={post.img}
                key={post.id}
                theme={theme}
              />
            ))}
          </Group>
        </Stack>
      </Box>
      <Stack
        data-aos="fade"
        id="classes"
        align={"center"}
        justify={"start"}
        sx={{
          maxWidth: "70rem",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "20px",
        }}
      >
        <Title>CHOOSE YOUR BALLET CLASS</Title>
        <Text
          sx={{
            textAlign: "center",
            [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
              textAlign: "unset",
            },
          }}
        >
          Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum{" "}
        </Text>
        <Group
          sx={{
            flexWrap: "wrap",
            gap: "10px",
            marginTop: "10px",
            justifyContent: "center",
            [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
              flexWrap: "nowrap",
              gap: "0",
            },
          }}
        >
          <LessonCard
            theme={theme}
            onTop={false}
            title={"Beginners"}
            price={"45$"}
            body={"Lorem ipsum lorem ipsum lorem ipsum lorem ipsum "}
            checks={["Online", "8 Weeks Course"]}
            url={"BeginnersOnline"}
          />
          <LessonCard
            theme={theme}
            onTop={true}
            title={"One on One"}
            price={"55$"}
            body={"Lorem ipsum lorem ipsum lorem ipsum"}
            checks={["Online", "8 Weeks Course"]}
            url={"OneOnOne"}
          />

          <LessonCard
            theme={theme}
            onTop={false}
            title={"Intermediate"}
            price={"45$"}
            body={"Lorem ipsum lorem ipsum lorem ipsum"}
            checks={["Online", "8 Weeks Course"]}
            url={"IntermediateOnline"}
          />
        </Group>
      </Stack>

      <Stack
        data-aos="fade"
        id="testimonials"
        mt={"30px"}
        align="center"
        sx={{
          width: "100%",
          backgroundColor: theme.colors.gray[0],
          padding: "10px",
        }}
      >
        <Title>Our Satisfied Clients</Title>

        <Group
          sx={{
            marginTop: "20px",
            flexWrap: "nowrap",
            justifyContent: "space-around",
          }}
        >
          <ActionIcon
            sx={{ zIndex: 1 }}
            onClick={() => {
              if (currentTestimonial - 1 < 0) {
                return;
              }

              setCurrentTestimonial(currentTestimonial - 1);
            }}
          >
            <IconArrowLeft size={32} />
          </ActionIcon>

          {testimonials[currentTestimonial]}

          <ActionIcon
            sx={{ zIndex: 1 }}
            onClick={() => {
              if (currentTestimonial + 1 >= 2) {
                return;
              }

              setCurrentTestimonial(currentTestimonial + 1);
            }}
          >
            <IconArrowRight size={32} />
          </ActionIcon>
        </Group>
      </Stack>

      <Footer theme={theme} />
    </>
  );
};

export default Home;
