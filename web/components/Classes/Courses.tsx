import { MantineTheme } from "@mantine/core";
import { useEffect, useState } from "react";
import { ClassesProps } from "../../pages/classes";
import { CourseNames } from "../../pages/courses";
import CourseCard from "./CourseCard";

interface CoursesProps {
  theme: MantineTheme;
  context: ClassesProps;
}

const Courses = ({ theme, context }: CoursesProps) => {
  const [soldOutFirst, setSoldOutFirst] = useState(
    context?.beginnersLevelOne?.soldOut
  );
  const [soldOutSecond, setSoldOutSecond] = useState(
    context?.intermediateLevelOne?.soldOut
  );
  const [soldOutThird, setSoldOutThird] = useState(
    context?.beginnersLevelOneSeniors?.soldOut
  );

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
        url={CourseNames.BeginnersLevelOne}
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
        url={CourseNames.IntermediateLevelOne}
        soldOut={soldOutSecond}
      />

      <CourseCard
        theme={theme}
        onTop={false}
        title={"Beginners (Seniors)"}
        oldPrice={"90£"}
        price={"72£"}
        body={"Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
        checks={["Level One", "Online", "8 Weeks Course"]}
        url={CourseNames.BeginnersLevelOneSeniors}
        soldOut={soldOutThird}
      />
    </>
  );
};

export default Courses;
