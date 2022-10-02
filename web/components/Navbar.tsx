import { Group, Title, Anchor, Menu, Stack, Box, Image, Text, MantineTheme, Avatar } from "@mantine/core"
import { IconBrandFacebook, IconBrandInstagram, IconMenu2 } from "@tabler/icons"
import { useEffect, useState } from "react";
import logout from "../utils/logout";
import me from "../utils/me";

import MainPageAnchor from "./MainPageAnchor"

interface NavbarProps {
    theme: MantineTheme
}

const Navbar = ({ theme }: NavbarProps) => {

    const [menuOpen, setMenuOpen] = useState(false);
    const [logged, setLogged] = useState(false);

    useEffect(() => {

        const checkMe = async () => {
            const response = await me();

            if (response.status !== 200) {

            } else {
                setLogged(true)

            }

        }

        checkMe().catch(console.error)

    }, [])

    const handleLogout = async () => {
        let response = await logout();

        if (response.status !== 200) {
            return;
        }
        setLogged(false)

        console.log('logout')
    }

    return (
        <>
            <Box sx={{
                display: 'grid',
                maxHeight: '80px',
                marginTop: '10px',

                paddingLeft: '20px',
                paddingRight: '20px',
                gridTemplateColumns: '50% 50%',
                [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
                    // paddingLeft: '50px',
                    // paddingRight: '50px',
                    width: '100%',
                    padding: 0,
                    gridTemplateColumns: '20% 1fr 15%',
                    maxWidth: '70rem',
                    marginLeft: 'auto',
                    marginRight: 'auto',

                }
            }}>

                <Group position='left' sx={{
                    gap: '0'
                }}>
                    <Image src="https://i.imgur.com/L2fSEaN.png" alt='logo' width={80} height={80} sx={{


                        [`@media (min-width: ${theme.breakpoints.lg}px)`]: {

                            maxWidth: '80px',
                            maxHeight: '80px',

                        }

                    }}>Logo</Image>
                    {/* <Title order={2} sx={{
                        fontWeight: 'bold',
                        letterSpacing: '1.3px',
                        fontSize: '19px',
                        zIndex: 1,
                        [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
                            fontSize: '26px'
                        }
                    }}>MBALLET</Title> */}
                </Group>

                <Group sx={{
                    fontSize: '18px',
                    justifyContent: 'end',
                    display: 'none',
                    zIndex: 1,
                    [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
                        display: 'flex'
                    },

                }}>
                    <Anchor href='#home' variant='text' sx={{

                        '&:hover': {
                            color: theme.colors.main[1]
                        }
                    }}>Home</Anchor>
                    <Anchor href='#aboutUs' variant='text' sx={{

                        '&:hover': {
                            color: theme.colors.main[1]
                        }
                    }}>About Us</Anchor>
                    <Anchor href='#classes' variant='text' sx={{

                        '&:hover': {
                            color: theme.colors.main[1]
                        }
                    }}>Classes</Anchor>
                    <Anchor href='#testimonials' variant='text' sx={{

                        '&:hover': {
                            color: theme.colors.main[1]
                        }
                    }}>Testimonials</Anchor>
                    {logged ? <Avatar sx={{
                        cursor: 'pointer'
                    }} size='lg' radius='xl' /> : <Anchor href='/login' variant='text' sx={{

                        '&:hover': {
                            color: theme.colors.main[1]
                        }
                    }}>Sign in</Anchor>}

                </Group>

                <Group sx={{
                    justifyContent: 'end',
                    fontWeight: 'normal',
                    alignContent: 'center',
                    display: 'none',
                    zIndex: 1,
                    [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
                        display: 'flex'
                    }
                }}>

                    <IconBrandFacebook cursor={'pointer'} />
                    <IconBrandInstagram cursor={'pointer'} />
                </Group>

                <Menu opened={menuOpen} onChange={setMenuOpen} zIndex={1} width={'100%'}
                    styles={{
                    }}
                >
                    <Menu.Target>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'end',
                            alignItems: 'center',
                            zIndex: 1,
                            [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
                                display: 'none'
                            }
                        }}>
                            <IconMenu2 size={40} />
                        </Box>
                    </Menu.Target>

                    <Menu.Dropdown sx={{
                        padding: 0,
                        backgroundColor: theme.colors.dark[6],
                        fontWeight: 'bold'

                    }} >
                        <Stack onClick={() => setMenuOpen(!menuOpen)} sx={{
                            gap: 0
                        }} >

                            <MainPageAnchor href='#home' theme={theme}>Home</MainPageAnchor>
                            <MainPageAnchor href='#aboutUs' theme={theme}>About Us</MainPageAnchor>
                            <MainPageAnchor href='#classes' theme={theme}>Classes</MainPageAnchor>
                            <MainPageAnchor href='#testimonials' theme={theme}>Testimonials</MainPageAnchor>

                        </Stack>

                    </Menu.Dropdown>

                </Menu>


            </Box>

        </>
    )
}


export default Navbar