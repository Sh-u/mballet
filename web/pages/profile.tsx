import { Box, Center, Loader, SimpleGrid, Stack } from "@mantine/core";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import me from "../utils/me";
import getUserBookings from "../utils/requests/bookings/getUserBookings";
import dayjs from "dayjs";
import { BalletClass } from "./bookings";
interface Booking {
  id: number;
  booked_at: Date;
  booked_by: string;
}

const ProfilePage = () => {
  const router = useRouter();
  const [isLoading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [classes, setClasses] = useState<BalletClass[] | null>(null);
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
      const res = await getUserBookings(userId);

      if (!res.ok) {
        return;
      }
      let items = await res.json();
      setClasses(items);
    };

    const checkLogged = async () => {
      const response = await me();

      if (!response.ok) {
        router.push("/login");
        return;
      }
      let userObj = await response.json();
      getBookings(userObj.id);
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
    <Stack>
      {bookings
        ? bookings.map((booking) => (
            <Box key={booking.id}>
              {dayjs(booking.booked_at).format("DD/MM/YYYY HH:mm:ss")}
            </Box>
          ))
        : null}
    </Stack>
  );
};

export default ProfilePage;
