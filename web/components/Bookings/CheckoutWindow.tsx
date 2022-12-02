import { Stack, Divider, Button, Text, Box, MantineTheme } from "@mantine/core";
import { time } from "console";

import React from "react";
import { RenderState, TimeButton } from "../../pages/bookings";
import mapToBrowserName from "../../utils/mapToBrowserName";

interface CheckoutWindowProps {
  theme: MantineTheme;
  class_query: string | string[] | undefined;
  renderState: RenderState;
  handleProceedPayment: () => void;
  value: Date;
  time: TimeButton | null;
  classPrice: string | null;
}

const CheckoutWindow = ({
  theme,
  class_query,
  renderState,
  handleProceedPayment,
  value,
  time,
  classPrice,
}: CheckoutWindowProps) => {
  return (
    <Stack
      p="xl"
      sx={(theme) => ({
        border: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
        }`,
      })}
    >
      <Text size={"xl"} weight="bold">
        {mapToBrowserName(class_query as string)}
      </Text>
      <Text size={"md"}>1hr | {classPrice} £</Text>
      <Divider />
      <Box>
        <Text size={"lg"}>{value?.toDateString()}</Text>
        <Text size={"lg"}>{time?.time}</Text>
      </Box>

      {renderState === RenderState.payment ? (
        <Button disabled>Proceed with payment</Button>
      ) : (
        <Button onClick={() => handleProceedPayment()}>Book</Button>
      )}
    </Stack>
  );
};

export default CheckoutWindow;
