import { Group, Stack, Text, Title, useMantineTheme } from "@mantine/core";
import ClassItem from "../components/ClassItem";
import Footer from "../components/Footer";
import LessonCard from "../components/LessonCard";
import MainContentWrapper from "../components/MainContentWrapper";
import Navbar from "../components/Navbar";

const ClassesPage = () => {
  const theme = useMantineTheme();
  return (
    <>
      <Navbar theme={theme} />

      <MainContentWrapper theme={theme}>
        <Stack
          justify={"center"}
          align="center"
          sx={{
            maxWidth: "70rem",
            margin: "auto",
          }}
        >
          <Stack
            align="center"
            p="lg"
            sx={{
              textAlign: "center",
            }}
          >
            <Title>Choose your ballet course</Title>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
              tellus, luctus nec ullamcorper mattis pulvinar.
            </Text>
          </Stack>
          <Group
            noWrap={false}
            position={"center"}
            sx={{
              gap: "16px",
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
              price={"30$"}
              body={"Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
              checks={["Online", "8 Weeks Course"]}
              url={"BeginnersOnline"}
            />
            <LessonCard
              theme={theme}
              onTop={true}
              title={"One on One"}
              price={"55$"}
              body={"Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
              checks={["Online", "8 Weeks Course"]}
              url={"OneOnOne"}
            />

            <LessonCard
              theme={theme}
              onTop={false}
              title={"Intermediate"}
              price={"45$"}
              body={"Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
              checks={["Online", "8 Weeks Course"]}
              url={"IntermediateOnline"}
            />
          </Group>

          <Stack
            align="center"
            p="lg"
            sx={{
              textAlign: "center",
            }}
          >
            <Title>Choose your ballet class</Title>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
              tellus, luctus nec ullamcorper mattis pulvinar.
            </Text>
          </Stack>

          <Group
            noWrap={false}
            position={"center"}
            sx={{
              gap: "16px",
              [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
                flexWrap: "nowrap",
              },
            }}
          >
            <ClassItem
              theme={theme}
              price={"45$"}
              title={"BEGINNERS"}
              body={
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis pulvinar."
              }
              href={"/bookings?lesson=BeginnersOnline"}
            />
            <ClassItem
              theme={theme}
              price={"55$"}
              title={"ONE ON ONE"}
              body={
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis pulvinar."
              }
              href={"/bookings?lesson=OneOnOne"}
            />
            <ClassItem
              theme={theme}
              price={"45$"}
              title={"INTERMEDIATE"}
              body={
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis pulvinar."
              }
              href={"/bookings?lesson=BeginnersOnline"}
            />
          </Group>
        </Stack>
      </MainContentWrapper>

      <Footer theme={theme} />
    </>
  );
};

export default ClassesPage;
