import {
  Box,
  Center,
  Loader,
  SimpleGrid,
  Stack,
  useMantineTheme,
  Title,
  Text,
  Tabs,
} from "@mantine/core";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import me from "../utils/me";
import getUserBookings from "../utils/requests/bookings/getUserBookings";
import dayjs from "dayjs";
import { BalletClass } from "./bookings";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MainContentWrapper from "../components/MainContentWrapper";
import getUserClasses from "../utils/requests/bookings/getUserClasses";
interface Booking {
  id: number;
  booked_at: Date;
  booked_by: string;
}

const ProfilePage = () => {
  const router = useRouter();
  const [isLoading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [classes, setClasses] = useState<BalletClass[][] | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>("Upcoming");
  const theme = useMantineTheme();
  useEffect(() => {
    const getBookings = async (userId: number) => {
      const res = await getUserBookings(userId);

      if (!res.ok) {
        return;
      }
      let items = await res.json();
      setBookings(items);
    };

    const getClasses = async (userId: number) => {
      const res = await getUserClasses(userId);

      if (!res.ok) {
        return;
      }
      let items: BalletClass[] = await res.json();

      let upcoming: BalletClass[] = [],
        history: BalletClass[] = [];

      items.forEach((item) =>
        new Date(item.class_date) < new Date()
          ? history.push(item)
          : upcoming.push(item)
      );

      setClasses([upcoming, history]);
    };

    const checkLogged = async () => {
      const response = await me();

      if (!response.ok) {
        router.push("/login");
        return;
      }
      let userObj = await response.json();
      getBookings(userObj.id);
      getClasses(userObj.id);
      setLoading(false);
    };

    checkLogged().catch(console.error);
  }, [router]);

  if (isLoading) {
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
          m="auto"
          sx={{
            maxWidth: "70rem",
          }}
        >
          <Title>Manage Your Bookings </Title>
          <Text>
            View, reschedule or cancel your bookings and easily book again.
          </Text>
          <Text>Time Zone: British Summer Time (GMT+1)</Text>
          <Tabs
            value={activeTab}
            onTabChange={setActiveTab}
            sx={{
              fontSize: "16px",
            }}
          >
            <Tabs.List>
              <Tabs.Tab
                sx={{
                  fontSize: "24px",
                }}
                value="Upcoming"
              >
                Upcoming
              </Tabs.Tab>
              <Tabs.Tab
                value="History"
                sx={{
                  fontSize: "24px",
                }}
              >
                History
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="Upcoming">
              {" "}
              {classes
                ? classes[0]?.map((c, i) => (
                    <Box
                      key={`${c.id}${i}`}
                      sx={{
                        fontSize: "20px",
                        "&:hover": {
                          backgroundColor: theme.colors.gray[2],
                        },
                      }}
                    >
                      {dayjs(c.class_date)
                        .add(1, "hour")
                        .toDate()
                        .toLocaleString("default", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      <Text size="sm">{c.class_name}</Text>
                    </Box>
                  ))
                : null}
            </Tabs.Panel>
            <Tabs.Panel value="History">
              We’re looking forward to meeting you.
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </MainContentWrapper>
      <Footer theme={theme} />
    </>
  );
};

export default ProfilePage;
