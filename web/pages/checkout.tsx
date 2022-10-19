import { Title, Anchor, useMantineTheme, Stack } from "@mantine/core";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import MainContentWrapper from "../components/MainContentWrapper";

const CheckoutPage = () => {
  const theme = useMantineTheme();
  return (
    <>
      <Navbar theme={theme} />
      <MainContentWrapper theme={theme}>
        <Stack
          justify={"center"}
          align="center"
          sx={{
            maxWidth: "70rem",
            margin: "auto",
            height: "25rem",
          }}
        >
          <Title>Your purchase was successful!</Title>
          <Link href="/classes" passHref>
            <Anchor component="a">Continue Shopping</Anchor>
          </Link>
        </Stack>
      </MainContentWrapper>
      <Footer theme={theme} />
    </>
  );
};

export default CheckoutPage;
