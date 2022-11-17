import { Group, Stack, Text, Title, useMantineTheme } from "@mantine/core";
import ClassCard from "../components/Classes/ClassCard";
import Footer from "../components/Footer";
import CourseCard from "../components/Classes/CourseCard";
import MainContentWrapper from "../components/MainContentWrapper";
import Navbar from "../components/Navbar";
import Courses from "../components/Classes/Courses";
import { useEffect, useState } from "react";
import checkSoldOutByName from "../utils/requests/bookings/checkSoldOutByName";
import { CourseNames, getDbCourseName } from "./courses";

const ClassesPage = () => {
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
            <Courses theme={theme} />
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

export default ClassesPage;
