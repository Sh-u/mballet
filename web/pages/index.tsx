import { Center, Group, Loader, Image, Text, Box, Anchor, Stack, SimpleGrid, BackgroundImage, Button, useMantineTheme, UnstyledButton, Title, ActionIcon, Avatar, Divider, Menu } from '@mantine/core';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import logout from '../utils/logout';
import me from '../utils/me';
import { IconBrandFacebook, IconBrandInstagram, IconArrowRight, IconArrowLeft, IconCertificate, IconUserCheck, IconThumbUp, IconQuote, IconCalendarEvent, IconMenu2 } from '@tabler/icons';
import LessonCards from '../components/LessonCards';
import "@fontsource/dancing-script";
import { ArrowRightIcon } from '@heroicons/react/solid';
import MainPageAnchor from '../components/MainPageAnchor';
import NewsCardPreview from '../components/NewsCardPreview';
import LessonCard from '../components/LessonCard';
import TestimonialCard from '../components/TestimonialCard';
import AOS from 'aos';
import "aos/dist/aos.css";
import Footer from '../components/Footer';
import { useRouter } from 'next/router';
const Home = () => {


  const [isLoading, setLoading] = useState(false)
  // const [testimonials, setTestimonials] = useState([{
  //   index: 0, position: 0, name: 'Caroline', description: 'Senior Student', body: `Miriam is a warm-hearted, engaging, passionate and exemplary ballet teacher and dancer. I consider myself incredibly lucky to have Miriam as my teacher.
  // I am 69 years old and have become, through her classes, strong in leg, supple in spine, flexible in mind, have transformed my posture and shed unwanted weight. In essence a younger body is revealed.
  // Miriam's training, rooted in the Russian lineage, shows a close attention to artistic and technical details, all conveyed at an extremely  high level, accompanied by very carefully chosen appropriate music.
  // There is no 'dumbing down' for the public here.  Miriam, mindful by our pace of learning and our individual physical needs, nevertheless ensures a rich and powering personal sense of achievement.
  // Finally, I find it very exciting to see, over time, how we can aspire to become closer to the elegance and strength of a vocational ballet dancer.`},

  // {
  //   index: 1, position: 0, name: 'Pam Baxter', description: 'Student', body: `I have known Miriam for over three and a half years when she first became my ballet teacher. From the very first lesson, I found her to be an extremely friendly person as well as a very thorough teacher.
  //  Although I was little more than a beginner, she took my tuition very seriously and strove to get the very best out of me. Therefore, the lessons have always been most enjoyable and I’ve been able to progress to an intermediate level fairly easily. I’ve had private lessons from her in small groups as well as larger groups in workshops and on Zoom.
  //  Our groups have enjoyed sharing their knowledge of ballet by watching various YouTube links that Miriam has selected and sometimes taken part in ballet quizzes that Miriam has organised for us.
  //  Miriam is also a very caring person and on many occasions, she has given me very helpful advice about nutrition and natural remedies for minor ailments. She is extremely knowledgeable about the dancer’s body and I trust her judgement implicitly.
  //  To sum up, I feel really  lucky to have found Miriam. She is the most conscientious of teachers and is truely one of life’s “good people`}])




  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const theme = useMantineTheme();
  const testimonials = [<TestimonialCard theme={theme}
    name={'Caroline'}
    description={'Senior Student'}
    body={`Miriam is a warm-hearted, engaging, passionate and exemplary ballet teacher and dancer. I consider myself incredibly lucky to have Miriam as my teacher.
  I am 69 years old and have become, through her classes, strong in leg, supple in spine, flexible in mind, have transformed my posture and shed unwanted weight. In essence a younger body is revealed.
  Miriam's training, rooted in the Russian lineage, shows a close attention to artistic and technical details, all conveyed at an extremely  high level, accompanied by very carefully chosen appropriate music.
  There is no 'dumbing down' for the public here.  Miriam, mindful by our pace of learning and our individual physical needs, nevertheless ensures a rich and powering personal sense of achievement.
  Finally, I find it very exciting to see, over time, how we can aspire to become closer to the elegance and strength of a vocational ballet dancer.`}
    visible={'flex'}
    position={0} />,
  <TestimonialCard theme={theme} name={'Pam Baxter'} description={'Student'} body={`I have known Miriam for over three and a half years when she first became my ballet teacher. From the very first lesson, I found her to be an extremely friendly person as well as a very thorough teacher.
  Although I was little more than a beginner, she took my tuition very seriously and strove to get the very best out of me. Therefore, the lessons have always been most enjoyable and I’ve been able to progress to an intermediate level fairly easily. I’ve had private lessons from her in small groups as well as larger groups in workshops and on Zoom.
  Our groups have enjoyed sharing their knowledge of ballet by watching various YouTube links that Miriam has selected and sometimes taken part in ballet quizzes that Miriam has organised for us.
  Miriam is also a very caring person and on many occasions, she has given me very helpful advice about nutrition and natural remedies for minor ailments. She is extremely knowledgeable about the dancer’s body and I trust her judgement implicitly.
  To sum up, I feel really  lucky to have found Miriam. She is the most conscientious of teachers and is truely one of life’s “good people`} visible={'flex'} position={0} />
  ]
  const router = useRouter();
  useEffect(() => {
    AOS.init({
      easing: 'ease-in-out',
      once: true,
      duration: 700
    });
  }, []);


  useEffect(() => {
    console.log('state', testimonials)
  }, [testimonials])

  if (isLoading) return (
    <Center mt={'lg'}>
      <Loader size={'lg'}></Loader>
    </Center>

  )



  return (
    <>
      <SimpleGrid id='home' data-aos="fade" sx={{
        gridTemplateRows: 'auto 1fr auto',
        minHeight: '100%'
      }}>
        <Navbar theme={theme} />

        <BackgroundImage src='https://i.imgur.com/4djScCf.jpg' sx={{
          height: '50%',
          width: '100%',
          opacity: 0.5,
          position: 'absolute',
          // bottom: 0,
          gridColumn: '1 /  span 3',
          pointerEvents: 'none',

          [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
            minHeight: '100%',
          },
          [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
            minHeight: '100%',
          }
        }} />

        <Stack sx={{
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}>

          <Title sx={{

            opacity: 1,
            fontSize: '70px',
            color: theme.colors.dark[6],
            [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
              fontSize: '120px',
              marginTop: 'auto'
            },
            [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
              fontSize: '160px',
              marginTop: 'unset'

            }


          }}>MBALLET</Title>
          <Button rightIcon={<IconArrowRight size={14} />} radius={'xs'} styles={{
            root: {

              backgroundColor: theme.colors.dark[6],
              color: 'white',
              height: '50px',
            },

          }} sx={{
            fontSize: '14px',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 'normal',

            '&:hover': {
              border: '2px black solid',
              transition: '0.2s ease-in-out',
              backgroundColor: 'unset',
              color: 'black',
            },
          }}>
            Learn More
          </Button>

          <Group sx={{
            backgroundColor: 'rgba(150,150,150, 0.2)',
            justifyContent: 'center',
            color: theme.colors.gray[9],
            maxWidth: '80%',
            margin: 'auto',
            padding: '10px',
            position: 'relative',
            bottom: '-20px',

            [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
              padding: '50px',
              maxWidth: '70rem',
              position: 'absolute',
              bottom: '-30px',
            },

            [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
              bottom: '0',
              margin: '0',
              marginTop: 'auto'
            }

          }}>
            <Stack align={'center'} sx={{
              justifyContent: 'center',
              display: 'block',
              maxWidth: '70%',

              [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
                textAlign: 'center',
                maxWidth: '100%'
              },

              [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
                maxWidth: '30%',
                textAlign: 'unset'
              },
            }}>
              <Title sx={{
                fontSize: '28px',
                fontWeight: 'bold',
                letterSpacing: '1px',



              }}>  BALLET SCHOOL & STUDIO</Title>
              <Text >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. </Text>
            </Stack>

            <Stack align={'center'}>
              <IconCertificate />
              <Title sx={{


                fontSize: '24px',
              }}>  PROFESSIONAL</Title>
              <Text >Lorem ipsum something</Text>
            </Stack>

            <Stack align={'center'}>
              <IconUserCheck />
              <Title sx={{


                fontSize: '24px',
              }}>  EXPERIENCED</Title>
              <Text>Lorem ipsum something</Text>
            </Stack>

            <Stack align={'center'}>
              <IconThumbUp />
              <Title sx={{

                fontSize: '24px',
              }}>BEGINNER FRIENDLY</Title>
              <Text >Lorem ipsum something</Text>
            </Stack>

          </Group>
        </Stack>

      </SimpleGrid>

      <SimpleGrid data-aos="fade" id='aboutUs' sx={{
        gridTemplateColumns: '1fr',
        maxWidth: '70rem',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '20px',
        height: 'fit-content',

        [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
          gridTemplateColumns: '40% 1fr',
          padding: '5px'
        },
        [`@media (min-width: ${theme.breakpoints.md}px)`]: {
          padding: 0
        }


      }}>
        <Image src='https://i.imgur.com/BnIo6F3.jpg' height={600} sx={{

        }} />
        <Stack align={'start'} justify='center' sx={{
          padding: '20px',
          [`@media (min-width: ${theme.breakpoints.xs}px)`]: {

            padding: '0'
          }
        }}>
          <Title>
            About Us
          </Title>
          <Text sx={{
            fontSize: '16px',
            letterSpacing: '0.5px'
          }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
          </Text>
          <Text sx={{
            fontSize: '16px',
            letterSpacing: '0.5px',
            marginTop: '20px'
          }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
          </Text>

          <Text sx={{
            fontSize: '24px',
            fontFamily: 'Dancing Script, sans-serif',
            letterSpacing: '0.1px',

          }}>
            Miriam Pierzak
          </Text>

          <Button rightIcon={<IconArrowRight size={14} />} radius={'xs'} styles={{
            root: {
              backgroundColor: 'unset',
              color: 'black',
              border: '2px black solid',
              height: '50px',
            },

          }} sx={{
            fontSize: '14px',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 'normal',
            '&:hover': {

              transition: '0.2s ease-in-out',
              backgroundColor: theme.colors.gray[9],
              color: 'white',
            },
          }}>
            Contact Us
          </Button>
        </Stack>
      </SimpleGrid>

      <Box data-aos="fade" sx={{
        backgroundColor: theme.colors.gray[1]
      }}>
        <Stack sx={{
          paddingTop: '20px',
          paddingBottom: '20px',
          maxWidth: '70rem',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '20px',



        }}>
          <Group sx={{
            flexWrap: 'wrap',
            flexDirection: 'column',
            [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: '20px'
            },
            [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
              padding: 0
            }
          }}>
            <Stack sx={{
              maxWidth: '50%',

            }}>
              <Title sx={{
                textAlign: 'center',
                [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
                  textAlign: 'unset'
                }
              }}>News</Title>
              <Text sx={{
                textAlign: 'center',
                [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
                  textAlign: 'unset'
                }
              }}> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</Text>
            </Stack>

            <Button onClick={() => router.push('/news')} rightIcon={<IconArrowRight size={14} />} radius={'xs'} styles={{
              root: {
                backgroundColor: 'unset',
                color: 'black',
                border: '2px black solid',
                height: '50px',
              },

            }} sx={{
              fontSize: '14px',
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 'normal',
              '&:hover': {

                transition: '0.2s ease-in-out',
                backgroundColor: theme.colors.gray[9],
                color: 'white',
              },
            }}>
              Learn more
            </Button>
          </Group>


          <Group sx={{
            flexWrap: 'wrap',
            justifyContent: 'center',
            [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
              flexWrap: 'nowrap',
              justifyContent: 'unset',
            }
          }}>
            <NewsCardPreview theme={theme} />

            <NewsCardPreview theme={theme} />

            <NewsCardPreview theme={theme} />
          </Group>

        </Stack>
      </Box>
      <Stack data-aos="fade" id='classes' align={'center'} justify={'start'} sx={{
        maxWidth: '70rem',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '20px',
      }}>
        <Title>CHOOSE YOUR BALLET CLASS</Title>
        <Text sx={{
          textAlign: 'center',
          [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
            textAlign: 'unset'
          }
        }}>Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum </Text>
        <Group sx={{
          flexWrap: 'wrap',
          gap: '10px',
          marginTop: '10px',
          justifyContent: 'center',
          [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
            flexWrap: 'nowrap',
            gap: '0'
          }
        }}>
          <LessonCard
            theme={theme}
            onTop={false}
            title={'Beginners'}
            price={'45$'}
            body={"Lorem ipsum lorem ipsum lorem ipsum lorem ipsum "}
            checks={'Online'}
            url={'BeginnersOnline'} />
          <LessonCard
            theme={theme}
            onTop={true}
            title={'One on One'}
            price={'55$'}
            body={"Lorem ipsum lorem ipsum lorem ipsum"}
            checks={'Online'}
            url={'OneOnOne'} />

          <LessonCard
            theme={theme}
            onTop={false}
            title={'Intermediate'}
            price={'45$'}
            body={"Lorem ipsum lorem ipsum lorem ipsum"}
            checks={'Online'}
            url={'IntermediateOnline'} />

        </Group>
      </Stack>

      <Stack data-aos="fade" id='testimonials' mt={'30px'} align='center' sx={{
        width: '100%',
        backgroundColor: theme.colors.gray[2],
        padding: '10px'
      }}>
        <Title>Our Satisfied Clients</Title>

        <Group sx={{
          marginTop: '20px',
          flexWrap: 'nowrap',
          justifyContent: 'space-around'
        }}>
          <ActionIcon sx={{ zIndex: 1 }} onClick={() => {

            if (currentTestimonial - 1 < 0) {
              return;
            }

            setCurrentTestimonial(currentTestimonial - 1)

          }
          }>
            <IconArrowLeft size={32} />
          </ActionIcon>

          {
            testimonials[currentTestimonial]
          }

          <ActionIcon sx={{ zIndex: 1 }} onClick={() => {

            if (currentTestimonial + 1 >= 2) {
              return;
            }

            setCurrentTestimonial(currentTestimonial + 1)
          }
          }>
            <IconArrowRight size={32} />
          </ActionIcon>
        </Group>
      </Stack>

      <Footer theme={theme} />

    </>
  )
}



export default Home;