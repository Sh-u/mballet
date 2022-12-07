import {
  Center,
  Divider,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSwr from "swr";
import CourseCheckoutWindow from "../components/Bookings/CoursesCheckoutWindow";
import PaymentCompletion from "../components/Bookings/PaymentCompletion";
import Footer from "../components/Footer";
import MainContentWrapper from "../components/MainContentWrapper";
import Navbar from "../components/Navbar";
import me from "../utils/me";
import { initialOptions } from "../utils/paypalInitialOptions";
import createOrder from "../utils/requests/bookings/createOrder";
import getAllAvailableClassesByName, {
  SwrError,
} from "../utils/requests/bookings/getAllAvailableClassesByName";
import { getClassesPrice } from "../utils/requests/bookings/getClassesPrice";
import onApprove from "../utils/requests/bookings/onApprove";
import { BalletClass, RenderState } from "./bookings";
export enum CourseNames {
  BeginnersLevelOne = "beginners-level-one",
  IntermediateLevelOne = "intermediate-level-one",
  BeginnersLevelOneSeniors = "beginners-level-one-seniors",
}

export const getDbCourseName = (course: CourseNames): string => {
  switch (course) {
    case CourseNames.BeginnersLevelOne:
      return "Course_Beginners_Level_One";
    case CourseNames.IntermediateLevelOne:
      return "Course_Intermediate_Level_One";
    case CourseNames.BeginnersLevelOneSeniors:
      return "Course_Beginners_Level_One_Seniors";
  }
};

const getClientCourseName = (course: CourseNames): string => {
  switch (course) {
    case CourseNames.BeginnersLevelOne:
      return "Beginners Course (Level One)";
    case CourseNames.IntermediateLevelOne:
      return "Intermediate Course (Level One)";
    case CourseNames.BeginnersLevelOneSeniors:
      return "Ballet Course For Beginners (Level One) - Seniors";
  }
};

const CoursesPage = () => {
  const theme = useMantineTheme();
  const router = useRouter();
  const { course: course_query } = router.query;
  const [coursePrice, setCoursePrice] = useState("");
  const [renderState, setRenderState] = useState(RenderState.payment);

  useEffect(() => {
    const checkLogged = async () => {
      const response = await me();
      if (response.status !== 200) {
        router.push("/login");
        return;
      }
    };

    checkLogged().catch(console.error);
    if (
      router.isReady &&
      ![
        CourseNames.BeginnersLevelOne,
        CourseNames.BeginnersLevelOneSeniors,
      ].includes(course_query as CourseNames)
    ) {
      router.push("/");
    }

    if (!course_query) return;

    const getCoursePrice = async () => {
      const course_name = getDbCourseName(course_query as CourseNames);
      const response = await getClassesPrice(course_name);

      if (response.status !== 200) {
        return;
      }

      const price = await response.text();
      setCoursePrice(price);
    };

    getCoursePrice().catch(console.error);
  }, [router, course_query]);

  const [fetchUrl, fetcher] = getAllAvailableClassesByName(
    getDbCourseName(course_query as CourseNames)
  );

  const {
    data: courseClasses,
    error,
    isValidating,
  } = useSwr<BalletClass[], SwrError>(course_query ? fetchUrl : null, fetcher);

  const handleApprovedPayment = () => {
    setRenderState(RenderState.paymentCompleted);
  };

  useEffect(() => {
    if (error || (courseClasses && !courseClasses.length)) {
      router.push("/classes");
      return;
    }
  }, [error, router, courseClasses]);

  if (!courseClasses || courseClasses.length < 1 || error) {
    return (
      <Center
        sx={{
          height: "100%",
        }}
      >
        <Loader size="xl" color="gray" variant="dots" />
      </Center>
    );
  }

  return (
    <>
      <Navbar theme={theme} />
      <MainContentWrapper theme={theme}>
        <Stack
          sx={{
            maxWidth: "70rem",
            margin: "50px auto auto auto",
          }}
        >
          <Title>Checkout</Title>
          <Divider />
          <SimpleGrid
            py="xl"
            sx={{
              gridTemplateColumns: "60% 40%",
            }}
          >
            <Stack>
              {renderState === RenderState.payment ? (
                <>
                  <Title>1. INFO</Title>
                  <Text>
                    {courseClasses?.length} sessions taking place at X-STUDIO
                  </Text>
                  <Title>2. PAYMENT</Title>
                  <PayPalScriptProvider options={initialOptions}>
                    <PayPalButtons
                      style={{
                        layout: "vertical",
                        color: "black",
                        tagline: false,
                      }}
                      createOrder={(data, actions) => {
                        return createOrder({
                          class_id: courseClasses?.map((c) => c.id as string),
                          // user_id: 1,
                        })
                          .then((response) => response.json())
                          .then((order) => order.id);
                      }}
                      onApprove={(data, actions) => {
                        return onApprove(data.orderID)
                          .then((response) => response.json())
                          .then((orderData) => {
                            console.log(
                              "Capture result",
                              orderData,
                              JSON.stringify(orderData, null, 2)
                            );
                            handleApprovedPayment();
                          });
                      }}
                    />
                  </PayPalScriptProvider>
                </>
              ) : (
                <PaymentCompletion />
              )}
            </Stack>
            <CourseCheckoutWindow
              coursePrice={(
                parseFloat(coursePrice) * courseClasses?.length
              ).toPrecision(4)}
              course_name={getClientCourseName(course_query as CourseNames)}
              sessions={courseClasses?.length}
              theme={theme}
            />
          </SimpleGrid>
        </Stack>
      </MainContentWrapper>
      <Footer theme={theme} />
    </>
  );
};

export default CoursesPage;
