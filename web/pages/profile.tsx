import {
  Box,
  Center,
  Group,
  Loader,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import MainContentWrapper from "../components/MainContentWrapper";
import Navbar from "../components/Navbar";
import me from "../utils/me";
import getUserBookings from "../utils/requests/bookings/getUserBookings";
import getUserClasses from "../utils/requests/bookings/getUserClasses";
import { BalletClass } from "./bookings";

dayjs.extend(utc);

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

      items.forEach((item) => {
        Date.parse(item.class_date) <
        Date.parse(dayjs.utc(new Date()).format("YYYY-MM-DDTHH:mm:ss"))
          ? history.push(item)
          : upcoming.push(item);
      });

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

  console.log(classes);
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
      <SimpleGrid
        sx={{
          height: "100%",
          gridTemplateRows: "auto 1fr auto",
        }}
      >
        <Navbar theme={theme} />
        <MainContentWrapper theme={theme}>
          <Stack
            m="auto"
            p="10px"
            sx={{
              maxWidth: "70rem",

              [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
                padding: 0,
              },
            }}
          >
            <Title size={48}>Manage Your Bookings </Title>
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
                  p="20px"
                  sx={{
                    fontSize: "24px",
                  }}
                  value="Upcoming"
                >
                  Upcoming
                </Tabs.Tab>
                <Tabs.Tab
                  p="20px"
                  value="History"
                  sx={{
                    fontSize: "24px",
                  }}
                >
                  History
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="Upcoming">
                {classes && classes[0].length > 0 ? (
                  classes[0]?.map((c, i) => (
                    <Box
                      py="10px"
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
                ) : (
                  <Group p="20px" position="center">
                    <Text size={32} weight="normal">
                      You`ve got nothing booked at the moment.
                    </Text>
                  </Group>
                )}
              </Tabs.Panel>
              <Tabs.Panel value="History">
                {classes && classes[1].length > 0 ? (
                  classes[1]?.map((c, i) => (
                    <Box
                      py="10px"
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
                ) : (
                  <Group p="20px" position="center">
                    <Text size={32} weight="normal">
                      We`re looking forward to meeting you.
                    </Text>
                  </Group>
                )}
              </Tabs.Panel>
            </Tabs>
          </Stack>
        </MainContentWrapper>
        <Footer theme={theme} />
      </SimpleGrid>
    </>
  );
};

export default ProfilePage;
