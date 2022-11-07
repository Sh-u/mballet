import "@fontsource/dancing-script";
import { Center, Loader, useMantineTheme } from "@mantine/core";
import AOS from "aos";
import "aos/dist/aos.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AboutUs from "../components/AboutUs/AboutUs";
import ClassesTrending from "../components/Classes/ClassesTrending";
import Footer from "../components/Footer";
import Hero from "../components/Home/Hero";
import News from "../components/News/News";
import TestimonialCard from "../components/Testimonials/TestimonialCard";
import Testimonials from "../components/Testimonials/Testimonials";
import { Post } from "../types";
import getAllPosts from "../utils/getAllPosts";

const testimonials = [
  <TestimonialCard
    key={"Caroline"}
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

const Home = () => {
  const [isLoading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const theme = useMantineTheme();

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

      const posts: Post[] = await response.json();

      setPosts(posts.slice(0, 3));
    };

    getPosts().catch(console.error);
  }, []);

  if (isLoading)
    return (
      <Center mt={"lg"}>
        <Loader size={"lg"}></Loader>
      </Center>
    );

  return (
    <>
      <Hero theme={theme} />
      <AboutUs theme={theme} />
      <News theme={theme} posts={posts} />
      <ClassesTrending theme={theme} />
      <Testimonials
        theme={theme}
        currentTestimonial={currentTestimonial}
        setCurrentTestimonial={setCurrentTestimonial}
        testimonials={testimonials}
      />
      <Footer theme={theme} />
    </>
  );
};

export default Home;
