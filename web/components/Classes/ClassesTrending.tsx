import { Button, Group, MantineTheme, Stack, Text, Title } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons";
import Link from "next/link";
import Courses from "./Courses";

interface ClassesTrending {
  theme: MantineTheme;
}

const ClassesTrending = ({ theme }: ClassesTrending) => {
  return (
    <>
      <Stack
        data-aos="fade"
        id="classes"
        p="20px"
        sx={{
          maxWidth: "70rem",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "20px",
          [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
            padding: "20px 0 20px 0",
          },
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
          <Stack justify="start" py="20px">
            <Title
              sx={{
                textAlign: "center",
                [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
                  textAlign: "unset",
                  fontSize: "48px",
                },
              }}
            >
              CHOOSE YOUR BALLET CLASS
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
          </Stack>

          <Link href="/classes">
            <Button component="a" rightIcon={<IconArrowRight size={14} />}>
              Learn more
            </Button>
          </Link>
        </Group>

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
          <Courses theme={theme} />
        </Group>
      </Stack>
    </>
  );
};

export default ClassesTrending;
