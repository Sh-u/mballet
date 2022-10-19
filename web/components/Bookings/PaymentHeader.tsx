import { Stack, Button, Title, MantineTheme } from "@mantine/core";
import { IconArrowBack } from "@tabler/icons";
import { Dispatch, SetStateAction } from "react";
import { RenderState } from "../../pages/bookings";

interface PaymentHeaderProps {
  theme: MantineTheme;
  setRenderState: Dispatch<SetStateAction<RenderState>>;
}

const PaymentHeader = ({ theme, setRenderState }: PaymentHeaderProps) => {
  return (
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
        onClick={() => setRenderState(RenderState.booking)}
      >
        Back
      </Button>
      <Title>Payment Info</Title>
    </Stack>
  );
};

export default PaymentHeader;
