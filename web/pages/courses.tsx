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
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CourseCheckoutWindow from "../components/Bookings/CoursesCheckoutWindow";
import Footer from "../components/Footer";
import MainContentWrapper from "../components/MainContentWrapper";
import Navbar from "../components/Navbar";
import MapToDbName from "../utils/mapToDbName";
import me from "../utils/me";
import createOrder from "../utils/requests/bookings/createOrder";
import { getCoursesPrice } from "../utils/requests/bookings/getCoursesPrice";
import onApprove from "../utils/requests/bookings/onApprove";
import { RenderState } from "./bookings";
enum CourseNames {
  BeginnersLevelOne = "beginners-level-one",
  BeginnersLevelOneSeniors = "beginners-level-one-seniors",
}

const getDbCourseName = (course: CourseNames): string => {
  switch (course) {
    case CourseNames.BeginnersLevelOne:
      return "Course_Beginners_Level_One";
    case CourseNames.BeginnersLevelOneSeniors:
      return "Course_Beginners_Level_One_Seniors";
  }
};

const CoursesPage = () => {
  const theme = useMantineTheme();
  const router = useRouter();
  const { course: course_query } = router.query;
  const [coursePrice, setCoursePrice] = useState("");
  const [renderState, setRenderState] = useState(RenderState.booking);
  useEffect(() => {
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
      const response = await getCoursesPrice(course_name);

      if (response.status !== 200) {
        return;
      }

      const price = await response.text();
      setCoursePrice(price);
    };

    getCoursePrice().catch(console.error);
  }, [router, course_query]);

  const handleProceedPayment = async () => {
    const response = await me();
    if (response.status !== 200) {
      router.push("/login");
      return;
    }

    setRenderState(RenderState.payment);
  };

  if (!course_query) {
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
            <Stack align={"start"}>
              <Title>PAYMENT</Title>
              <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons
                  style={{ layout: "vertical", color: "black", tagline: false }}
                  createOrder={(data, actions) => {
                    return createOrder({
                      class_id: class_id,
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
            </Stack>
            <CourseCheckoutWindow
              coursePrice={coursePrice}
              course_name={course_query}
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
