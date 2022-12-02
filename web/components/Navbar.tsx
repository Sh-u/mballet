import {
  Anchor,
  Box,
  Group,
  Image,
  MantineTheme,
  Menu,
  NavLink,
  Stack,
} from "@mantine/core";
import { IconChevronDown, IconMenu2, IconX } from "@tabler/icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import logout from "../utils/logout";
import me from "../utils/me";
import MainPageAnchor from "./Home/MainPageAnchor";

interface NavbarProps {
  theme: MantineTheme;
}

const Navbar = ({ theme }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logged, setLogged] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);

  useEffect(() => {
    const checkMe = async () => {
      const response = await me();

      if (response.status !== 200) {
      } else {
        setLogged(true);
      }
    };

    checkMe().catch(console.error);
  }, []);

  const handleLogout = async () => {
    let response = await logout();

    if (response.status !== 200) {
      return;
    }
    setLogged(false);

    console.log("logout");
  };

  return (
    <>
      <Box
        sx={{
          display: "grid",
          maxHeight: "80px",
          marginTop: "10px",
          paddingLeft: "20px",
          paddingRight: "20px",
          gridTemplateColumns: "50% 50%",
          [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
            width: "100%",
            padding: 0,
            gridTemplateColumns: "20% 1fr 15%",
            maxWidth: "70rem",
            marginLeft: "auto",
            marginRight: "auto",
          },
        }}
      >
        <Group
          position="left"
          sx={{
            gap: "0",
          }}
        >
          <Image
            src="https://i.imgur.com/L2fSEaN.png"
            alt="logo"
            width={80}
            height={80}
            sx={{
              [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
                maxWidth: "80px",
                maxHeight: "80px",
              },
            }}
          >
            Logo
          </Image>
        </Group>

        <Group
          sx={{
            fontSize: "16px",
            justifyContent: "end",
            display: "none",
            zIndex: 1,
            [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
              display: "flex",
            },
          }}
        >
          <Link href="/">
            <Anchor component="a" p="15px">
              Home
            </Anchor>
          </Link>

          <Link href="/aboutus">
            <Anchor component="a" p="15px">
              About Us
            </Anchor>
          </Link>

          <Link href="/classes">
            <Anchor component="a" p="15px">
              Classes
            </Anchor>
          </Link>

          <Link href="/news">
            <Anchor component="a" p="15px">
              News
            </Anchor>
          </Link>

          {logged ? (
            <Menu opened={profileMenu} onChange={setProfileMenu}>
              <Menu.Target>
                <Group
                  p="15px"
                  sx={{
                    gap: "5px",
                    cursor: "pointer",
                  }}
                >
                  <Anchor variant="text">Profile</Anchor>
                  <IconChevronDown size={16} />
                </Group>
              </Menu.Target>
              <Menu.Dropdown
                sx={{
                  border: "unset",
                }}
              >
                <Link href="/profile">
                  <Menu.Item component="a">Your Bookings</Menu.Item>
                </Link>
                <Menu.Item onClick={() => handleLogout()}>Logout</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <Link href="/login">
              <Anchor component="a" p="15px">
                Sign in
              </Anchor>
            </Link>
          )}
        </Group>

        <Group
          sx={{
            justifyContent: "end",
            fontWeight: "normal",
            alignContent: "center",
            display: "none",
            zIndex: 1,
            [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
              display: "flex",
            },
          }}
        >
          <FaFacebook cursor={"pointer"} size={18} />
          <FaInstagram cursor={"pointer"} size={18} />
        </Group>

        <Menu
          opened={menuOpen}
          zIndex={999}
          width={"100%"}
          styles={{}}
          closeOnItemClick={false}
        >
          <Menu.Target>
            <Box
              sx={{
                width: "40px",
                justifySelf: "end",
                cursor: "pointer",
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
                zIndex: 1,
                [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
                  display: "none",
                },
              }}
            >
              {menuOpen ? (
                <IconX onClick={() => setMenuOpen(!menuOpen)} size={40} />
              ) : (
                <IconMenu2 onClick={() => setMenuOpen(!menuOpen)} size={40} />
              )}
            </Box>
          </Menu.Target>

          <Menu.Dropdown
            sx={{
              padding: 0,

              backgroundColor: theme.colors.dark[6],
              fontWeight: "bold",
            }}
          >
            <Stack
              sx={{
                gap: 0,
              }}
            >
              <MainPageAnchor href="/" theme={theme}>
                Home
              </MainPageAnchor>
              <MainPageAnchor href="/aboutus" theme={theme}>
                About Us
              </MainPageAnchor>
              <MainPageAnchor href="/classes" theme={theme}>
                Classes
              </MainPageAnchor>
              <MainPageAnchor href="/news" theme={theme}>
                News
              </MainPageAnchor>
              {logged ? (
                <NavLink label="Profile" childrenOffset={28}>
                  <Link href={"/profile"} passHref>
                    <NavLink
                      label="Your Bookings"
                      sx={{
                        paddingLeft: "20px",
                      }}
                    />
                  </Link>

                  <NavLink
                    onClick={() => handleLogout()}
                    label="Logout"
                    sx={{
                      paddingLeft: "20px",
                    }}
                  />
                </NavLink>
              ) : (
                <MainPageAnchor href="/login" theme={theme}>
                  Sign in
                </MainPageAnchor>
              )}
            </Stack>
          </Menu.Dropdown>
        </Menu>
      </Box>
    </>
  );
};

export default Navbar;
