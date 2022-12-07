import { Group, Stack, Text, Title, useMantineTheme } from "@mantine/core";
import { GetServerSideProps } from "next";
import ClassCard from "../components/Classes/ClassCard";
import Courses from "../components/Classes/Courses";
import Footer from "../components/Footer";
import MainContentWrapper from "../components/MainContentWrapper";
import Navbar from "../components/Navbar";
import checkSoldOutByName from "../utils/requests/bookings/checkSoldOutByName";
import { CourseNames, getDbCourseName } from "./courses";

export interface SoldOutResponse {
  soldOut: boolean;
}

export interface ClassesProps {
  beginnersLevelOne: SoldOutResponse;
  intermediateLevelOne: SoldOutResponse;
  beginnersLevelOneSeniors: SoldOutResponse;
}

const ClassesPage = (context: ClassesProps) => {
  const theme = useMantineTheme();

  return (
    <>
      <Navbar theme={theme} />

      <MainContentWrapper theme={theme}>
        <Stack
          justify={"center"}
          align="center"
          p={10}
          sx={{
            maxWidth: "70rem",
            margin: "auto",
            [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
              padding: 0,
            },
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
            <Courses theme={theme} context={context} />
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
                justifyContent: "space-between",
              },
            }}
          >
            <ClassCard
              theme={theme}
              price={"15£"}
              title={"BEGINNERS"}
              body={
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis pulvinar."
              }
              href={"/bookings?class=beginners-online"}
            />
            <ClassCard
              theme={theme}
              price={"35£"}
              title={"ONE ON ONE"}
              body={
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis pulvinar."
              }
              href={"/bookings?class=one-on-one"}
            />
            <ClassCard
              theme={theme}
              price={"20£"}
              title={"INTERMEDIATE"}
              body={
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis pulvinar."
              }
              href={"/bookings?class=intermediate-online"}
            />
          </Group>
        </Stack>
      </MainContentWrapper>

      <Footer theme={theme} />
    </>
  );
};

const checkAvailableCourses = async (name: CourseNames) => {
  const response = await checkSoldOutByName(getDbCourseName(name));

  if (!response.ok) {
    return;
  }
  const available = await response.json();

  return available;
};

export const getServerSideProps: GetServerSideProps = async () => {
  const beginnersLevelOneCourse = await checkAvailableCourses(
    CourseNames.BeginnersLevelOne
  ).catch(console.error);
  const beginnersLevelOneSeniorsCourse = await checkAvailableCourses(
    CourseNames.BeginnersLevelOneSeniors
  ).catch(console.error);
  const intermediateLevelOneCourse = await checkAvailableCourses(
    CourseNames.IntermediateLevelOne
  ).catch(console.error);

  return {
    props: {
      beginnersLevelOne: beginnersLevelOneCourse,
      intermediateLevelOne: intermediateLevelOneCourse,
      beginnersLevelOneSeniors: beginnersLevelOneSeniorsCourse,
    },
  };
};
export default ClassesPage;
