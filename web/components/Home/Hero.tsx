import {
  BackgroundImage,
  Button,
  Group,
  MantineTheme,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconArrowRight,
  IconCertificate,
  IconThumbUp,
  IconUserCheck,
} from "@tabler/icons";
import Navbar from "../Navbar";

interface HeroProps {
  theme: MantineTheme;
}

const Hero = ({ theme }: HeroProps) => {
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
            opacity: 0.3,
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
              backgroundColor: theme.colors.gray[2],
              justifyContent: "center",

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
    </>
  );
};

export default Hero;
