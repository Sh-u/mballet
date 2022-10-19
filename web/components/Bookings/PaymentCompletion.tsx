import { Stack, Title, Anchor } from "@mantine/core";
import Link from "next/link";

const PaymentCompletion = () => {
  return (
    <Stack
      align="center"
      justify="center"
      sx={{
        height: "100%",
      }}
    >
      <Title>Your purchase was successful!</Title>
      <Link href="/classes" passHref>
        <Anchor component="a">Continue Shopping</Anchor>
      </Link>
    </Stack>
  );
};

export default PaymentCompletion;
