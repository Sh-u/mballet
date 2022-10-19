import { Button, MantineTheme, Stack, Text } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { IconArrowBack } from "@tabler/icons";
import dayjs from "dayjs";
import router from "next/router";
import { CSSProperties, Dispatch } from "react";
import { Booking } from "../../pages/bookings";

interface CalendarProps {
  theme: MantineTheme;
  value: any;
  setValue: Dispatch<any>;
  bookings: Booking[];
}

const BookingsCalendar = ({
  theme,
  value,
  setValue,
  bookings,
}: CalendarProps) => {
  return (
    <>
      <Stack
        sx={{
          [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
            gridArea: "info",
          },
        }}
      >
        <Button
          sx={{ width: "fit-content" }}
          leftIcon={<IconArrowBack />}
          onClick={() => router.back()}
        >
          Back
        </Button>
        <Text size="xl" align="left">
          London time (GMT +01:00)
        </Text>
      </Stack>

      <Calendar
        allowLevelChange={false}
        value={value}
        onChange={setValue}
        fullWidth
        size="xl"
        sx={{
          maxWidth: "700px",
        }}
        dayStyle={(date: Date) =>
          dayjs(date).format("DD/MM/YYYY") === dayjs(value).format("DD/MM/YYYY")
            ? ({
                backgroundColor: theme.colors.dark[4],
              } as CSSProperties)
            : {}
        }
        excludeDate={(date) => {
          return !bookings?.some(
            (booking) =>
              dayjs(booking.booked_at).format("YYYY-MM-DD") ===
              dayjs(date).format("YYYY-MM-DD")
          );
        }}
        styles={(theme) => ({
          cell: {
            border: `1px solid ${
              theme.colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[2]
            }`,
          },
          calendarBase: {},
          day: {
            [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
              height: 70,
            },
            borderRadius: 0,
            height: 50,
            fontSize: theme.fontSizes.lg,
          },
          weekday: { fontSize: theme.fontSizes.lg, fontWeight: "bold" },
          weekdayCell: {
            fontSize: theme.fontSizes.xl,
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[5]
                : theme.colors.gray[0],
            border: `2px solid ${
              theme.colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[2]
            }`,
            height: 60,
            [`@media (min-width: ${theme.breakpoints.md}px)`]: {
              height: 70,
            },
          },
        })}
      />
    </>
  );
};

export default BookingsCalendar;
