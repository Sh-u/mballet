import { useMantineTheme, Box } from "@mantine/core";
import AboutUs from "../components/AboutUs/AboutUs";
import Footer from "../components/Footer";
import MainContentWrapper from "../components/MainContentWrapper";
import Navbar from "../components/Navbar";

const AboutUsPage = () => {
  const theme = useMantineTheme();
  return (
    <>
      <Navbar theme={theme} />
      <MainContentWrapper theme={theme}>
        <AboutUs theme={theme} />
      </MainContentWrapper>

      <Footer theme={theme} />
    </>
  );
};

export default AboutUsPage;
