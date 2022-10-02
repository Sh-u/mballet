import { Stack, Group, Title, Anchor, Button, Divider, Box, Text, MantineTheme } from "@mantine/core"
import { IconBrandFacebook, IconBrandInstagram, IconArrowRight } from "@tabler/icons"

interface FooterProps {
    theme: MantineTheme
}

const Footer = ({ theme }: FooterProps) => {

    return (
        <>
            <Box data-aos="fade" sx={{
                width: '100%',

            }}>

                <Stack sx={{
                    maxWidth: '70rem',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}>
                    <Group mt='30px' sx={{

                        justifyContent: 'space-around',
                        alignItems: 'start',
                        flexWrap: 'wrap',
                        padding: '20px',
                        [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
                            flexWrap: 'nowrap',
                        }

                    }}>
                        <Stack sx={{

                            justifyContent: 'center',
                            alignItems: 'start',
                            width: '80%',
                            [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
                                width: '33%',
                            }

                        }}>
                            <Title>
                                MBALLET
                            </Title>
                            <Text>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
                            </Text>
                            <Box >
                                <IconBrandFacebook cursor={'pointer'} />
                                <IconBrandInstagram cursor={'pointer'} />
                            </Box>

                        </Stack>
                        <Stack sx={{

                            justifyContent: 'center',
                            alignItems: 'start',
                            width: '80%',
                            [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
                                width: '33%',
                            }
                        }}>
                            <Title>NAVIGATION</Title>
                            <Anchor href='#home' variant='text' >Home</Anchor>
                            <Anchor href='#aboutUs' variant='text'>About Us</Anchor>
                            <Anchor href='#classes' variant='text'>Classes</Anchor>
                            <Anchor href='#testimonials' variant='text'>Testimonials</Anchor>
                        </Stack>
                        <Stack sx={{

                            justifyContent: 'center',
                            alignItems: 'start',
                            width: '80%',
                            [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
                                width: '33%',
                            }
                        }}>
                            <Title>WORK HOURS</Title>
                            <Text>7 AM - 5 PM, Mon - Sat</Text>
                            <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
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
                                Call Now
                            </Button>
                        </Stack>

                    </Group>

                    <Divider my="sm" />
                    <Title order={4} align='center' sx={{
                        padding: '20px',
                        fontWeight: 'normal'
                    }}>
                        © 2022 Mballet • All Rights Reserved
                    </Title>
                </Stack>
            </Box>
        </>
    )
}

export default Footer