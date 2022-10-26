import { MantineTheme } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { CourseNames, getDbCourseName } from "../../pages/courses";
import checkSoldOutByName from "../../utils/requests/bookings/checkSoldOutByName";
import CourseCard from "./CourseCard";

interface CoursesProps {
  theme: MantineTheme;
}

const Courses = ({ theme }: CoursesProps) => {
  const [soldOutFirst, setSoldOutFirst] = useState(false);
  const [soldOutSecond, setSoldOutSecond] = useState(false);
  const [soldOutThird, setSoldOutThird] = useState(false);

  useEffect(() => {
    const checkClasses = async (
      name: CourseNames,
      state: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
      const response = await checkSoldOutByName(getDbCourseName(name));

      if (!response.ok) {
        return;
      }
      const available = await response.json();

      state(available.soldOut);
    };

    checkClasses(CourseNames.BeginnersLevelOne, setSoldOutFirst).catch(
      console.error
    );
    checkClasses(CourseNames.BeginnersLevelOneSeniors, setSoldOutSecond).catch(
      console.error
    );
  }, []);

  useEffect(() => {
    const checkClasses = async (name: CourseNames) => {
      const response = await checkSoldOutByName(getDbCourseName(name));

      if (!response.ok) {
        return;
      }
      const available = await response.json();

      setSoldOutFirst(available.soldOut);
    };

    checkClasses(CourseNames.BeginnersLevelOneSeniors).catch(console.error);
  }, []);

  return (
    <>
      <CourseCard
        theme={theme}
        onTop={false}
        title={"Beginners"}
        oldPrice={"90£"}
        price={"72£"}
        body={"Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
        checks={["Level One", "Online", "8 Weeks Course"]}
        url={"beginners-level-one"}
        soldOut={soldOutFirst}
      />
      <CourseCard
        theme={theme}
        onTop={true}
        title={"Intermediate"}
        oldPrice={"108£"}
        price={"90$"}
        body={"Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
        checks={["Advanced", "Online", "8 Weeks Course"]}
        url={"one-on-one"}
        soldOut={true}
      />

      <CourseCard
        theme={theme}
        onTop={false}
        title={"Beginners (Seniors)"}
        oldPrice={"90£"}
        price={"72£"}
        body={"Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
        checks={["Level One", "Online", "8 Weeks Course"]}
        url={"beginners-level-one-seniors"}
      />
    </>
  );
};

export default Courses;
