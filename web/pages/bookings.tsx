import {
  Box,
  Center,
  Loader,
  SimpleGrid,
  Stack,
  useMantineTheme,
} from "@mantine/core";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSwr, { useSWRConfig } from "swr";
import BookingsCalendar from "../components/Bookings/BookingsCalendar";
import CheckoutWindow from "../components/Bookings/CheckoutWindow";
import CreateClass from "../components/Bookings/CreateClass";
import PaymentBody from "../components/Bookings/PaymentBody";
import PaymentCompletion from "../components/Bookings/PaymentCompletion";
import PaymentHeader from "../components/Bookings/PaymentHeader";

import Footer from "../components/Footer";
import MainContentWrapper from "../components/MainContentWrapper";
import Navbar from "../components/Navbar";
import useAlert, { UseAlertProps } from "../hooks/useAlert";

import MapToDbName from "../utils/mapToDbName";
import me from "../utils/me";
import getAllAvailableClassesByName from "../utils/requests/bookings/getAllAvailableClassesByName";
import { getClassesPrice } from "../utils/requests/bookings/getClassesPrice";

export interface TimeButton {
  time: string;
  index: number;
}

export interface BalletClass {
  class_date: string;
  class_name: string;
  class_type: string;
  created_at: string;
  id: string | number;
  slots: number;
}

enum AlertState {
  success,
  failure,
}

enum ClassNames {
  OneOnOne = "one-on-one",
  BeginnersOnline = "beginners-online",
}

export enum RenderState {
  booking,
  payment,
  paymentCompleted,
}

const BookingsPage = () => {
  const [value, setValue] = useState<any>(null);
  const [time, setTime] = useState<TimeButton | null>(null);
  const [alertInfo, setAlertInfo] = useState<UseAlertProps>({
    type: null,
    message: "",
  });
  const [renderState, setRenderState] = useState<RenderState>(
    RenderState.booking
  );
  const [classPrice, setClassPrice] = useState<string | null>(null);
  const myAlert = useAlert(alertInfo);
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const { class: class_query } = router.query;

  useEffect(() => {
    if (
      router.isReady &&
      ![ClassNames.BeginnersOnline, ClassNames.OneOnOne].includes(
        class_query as ClassNames
      )
    ) {
      router.push("/");
    }
    if (!class_query) return;

    const getLessonPrice = async () => {
      const lesson_name = MapToDbName(class_query as string);
      const response = await getClassesPrice(lesson_name);

      if (response.status !== 200) {
        return;
      }

      const price = await response.text();
      setClassPrice(price);
    };

    getLessonPrice().catch(console.error);
  }, [router, class_query]);

  const [fetchUrl, fetcher] = getAllAvailableClassesByName(
    MapToDbName(class_query as string)
  );

  const { data: classes } = useSwr<BalletClass[], any>(
    class_query ? fetchUrl : null,
    fetcher
  );

  useEffect(() => {
    if (alertInfo.type === null) {
      return;
    }
    const timer = setTimeout(() => {
      setAlertInfo({
        type: null,
        message: "",
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [alertInfo]);

  const theme = useMantineTheme();

  useEffect(() => {
    setTime(null);
  }, [value]);

  const handleSetAlertInfo = (type: AlertState, message: string) => {
    console.log("handleAlertInfoState");
    if (alertInfo.type === null) {
      console.log("setting Alert info", alertInfo);
      setAlertInfo({
        type: type,
        message: message,
      });
    }
  };

  const handleProceedPayment = async () => {
    const response = await me();
    if (response.status !== 200) {
      router.push("/login");
      return;
    }

    if (!value || !time) {
      return;
    }

    setRenderState(RenderState.payment);
  };

  if (!classes) {
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

  const handleApprovedPayment = () => {
    setTime(null);
    setValue(null);
    setRenderState(RenderState.paymentCompleted);
  };

  const checkRenderState = () => {
    switch (renderState) {
      case RenderState.booking:
        return (
          <BookingsCalendar
            theme={theme}
            value={value}
            setValue={setValue}
            bookings={classes}
          />
        );
      case RenderState.payment:
        if (!time) return;
        return (
          <>
            <PaymentHeader theme={theme} setRenderState={setRenderState} />

            <PaymentBody
              class_id={classes[time.index].id as string}
              handleApprovedPayment={handleApprovedPayment}
            />
          </>
        );

      case RenderState.paymentCompleted:
        return (
          <>
            <PaymentHeader theme={theme} setRenderState={setRenderState} />

            <PaymentCompletion />
          </>
        );
    }
  };

  return (
    <>
      <Navbar theme={theme} />
      <MainContentWrapper theme={theme}>
        <Stack
          align={"center"}
          sx={{
            maxWidth: "70rem",
            padding: "20px",
          }}
          mx={"auto"}
        >
          <SimpleGrid
            mt="2rem"
            sx={{
              gridTemplateRows: "auto 1fr auto auto",
              [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
                gridTemplateColumns: "700px 320px",
                gridTemplateAreas:
                  '"info info" "calendar checkout" "hour hour"',
                gridTemplateRows: "auto 1fr auto",
                gridAutoFlow: "column",
              },
            }}
          >
            {checkRenderState()}

            <Stack
              sx={{
                position: "relative",
                width: "280px",
                order: 1,

                marginLeft: 0,
                justifySelf: "center",
                [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
                  marginLeft: "30px",
                  gridArea: "checkout",
                  justifySelf: "unset",
                },
              }}
            >
              <CheckoutWindow
                classPrice={classPrice}
                class_query={class_query}
                handleProceedPayment={handleProceedPayment}
                renderState={renderState}
                theme={theme}
                time={time}
                value={value}
              />

              <CreateClass
                handleAddBooking={(booking) => {
                  console.log("create booking: ", booking);
                  if (!classes) {
                    return;
                  }

                  mutate(
                    fetchUrl,
                    async () => {
                      const bookings2 = [...classes, booking].sort((a, b) => {
                        if (dayjs(a.class_date).isBefore(b.class_date))
                          return -1;
                        else if (dayjs(a.class_date).isAfter(b.class_date))
                          return 1;
                        else return 0;
                      });

                      return bookings2;
                    },
                    { revalidate: false }
                  );
                }}
                handleSetAlertInfo={handleSetAlertInfo}
              />
              {myAlert}
            </Stack>

            {renderState === RenderState.booking ? (
              <SimpleGrid
                sx={{
                  gridTemplateColumns: "unset",
                  margin: "0",
                  padding: "0",
                  gap: "16px",
                  gridAutoFlow: "column",
                  gridTemplateRows: "repeat(3, auto)",
                  justifyContent: "start",
                }}
              >
                {classes?.map((balletClass, index) => {
                  const bookedAt = dayjs(
                    new Date(Date.parse(balletClass.class_date))
                  ).add(1, "hour");
                  if (
                    bookedAt.format("YYYY-MM-DD") !==
                    dayjs(value).format("YYYY-MM-DD")
                  ) {
                    return null;
                  }
                  let minutes = bookedAt.format("mm");
                  let newTime = `${bookedAt.hour()}:${minutes}`;

                  // console.log('bookedat', booking.booked_at)
                  return (
                    <Box
                      onClick={() => {
                        setTime({
                          time: newTime,
                          index: index,
                        });
                      }}
                      key={index}
                      sx={(theme) => ({
                        width: "100px",
                        border: `1px solid ${
                          theme.colorScheme === "dark"
                            ? theme.colors.dark[4]
                            : theme.colors.gray[2]
                        }`,
                        padding: theme.spacing.xs,
                        backgroundColor:
                          time?.index === index
                            ? theme.colors.dark[4]
                            : "-moz-initial",
                        color: time?.index === index ? "white" : "-moz-initial",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: theme.colors.dark[4],
                          color: "white",
                        },
                        [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
                          width: "150px",
                        },
                      })}
                    >
                      {newTime}
                    </Box>
                  );
                })}
              </SimpleGrid>
            ) : null}
          </SimpleGrid>
        </Stack>
      </MainContentWrapper>
      <Footer theme={theme} />
    </>
  );
};

export default BookingsPage;
