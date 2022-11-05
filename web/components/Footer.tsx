import {
  Anchor,
  Box,
  Button,
  Divider,
  Group,
  MantineTheme,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconArrowRight,
  IconBrandFacebook,
  IconBrandInstagram,
} from "@tabler/icons";
import Link from "next/link";

interface FooterProps {
  theme: MantineTheme;
}

const Footer = ({ theme }: FooterProps) => {
  return (
    <>
      <Box
        sx={{
          width: "100%",
        }}
      >
        <Stack
          sx={{
            maxWidth: "70rem",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Group
            mt="30px"
            sx={{
              justifyContent: "space-around",
              alignItems: "start",
              flexWrap: "wrap",

              [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
                flexWrap: "nowrap",
              },
            }}
          >
            <Stack
              sx={{
                justifyContent: "center",
                alignItems: "center",
                width: "80%",
                textAlign: "center",
                [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
                  width: "33%",
                  alignItems: "start",
                  textAlign: "unset",
                },
              }}
            >
              <Title>MBALLET</Title>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
                tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
              </Text>
              <Box>
                <IconBrandFacebook cursor={"pointer"} />
                <IconBrandInstagram cursor={"pointer"} />
              </Box>
            </Stack>
            <Stack
              sx={{
                justifyContent: "center",
                alignItems: "center",
                width: "80%",
                [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
                  width: "33%",
                  alignItems: "start",
                },
              }}
            >
              <Title>NAVIGATION</Title>
              <Link href="/" passHref>
                <Anchor component="a" variant="text">
                  Home
                </Anchor>
              </Link>

              <Link href="/aboutus" passHref>
                <Anchor component="a" variant="text">
                  About Us
                </Anchor>
              </Link>
              <Link href="/classes" passHref>
                <Anchor component="a" variant="text">
                  Classes
                </Anchor>
              </Link>
              <Link href="/news" passHref>
                <Anchor component="a" variant="text">
                  News
                </Anchor>
              </Link>
            </Stack>
            <Stack
              sx={{
                justifyContent: "center",

                alignItems: "center",
                width: "80%",
                [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
                  width: "33%",
                  alignItems: "start",
                },
              }}
            >
              <Title>WORK HOURS</Title>
              <Text>7 AM - 5 PM, Mon - Sat</Text>
              <Text
                sx={{
                  textAlign: "center",
                  [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
                    textAlign: "unset",
                  },
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </Text>
              <Button rightIcon={<IconArrowRight size={14} />}>Call Now</Button>
            </Stack>
          </Group>

          <Divider my="sm" />
          <Title
            order={4}
            align="center"
            sx={{
              padding: "20px",
              fontWeight: "normal",
            }}
          >
            © 2022 Mballet • All Rights Reserved
          </Title>
        </Stack>
      </Box>
    </>
  );
};

export default Footer;
