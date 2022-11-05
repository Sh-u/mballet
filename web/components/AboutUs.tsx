import {
  SimpleGrid,
  Stack,
  Title,
  Button,
  Image,
  Text,
  MantineTheme,
} from "@mantine/core";
import { IconArrowRight } from "@tabler/icons";

interface AboutUsProps {
  theme: MantineTheme;
}

const AboutUs = ({ theme }: AboutUsProps) => {
  return (
    <>
      <SimpleGrid
        data-aos="fade"
        id="aboutUs"
        sx={{
          gridTemplateColumns: "1fr",
          maxWidth: "70rem",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "20px",
          height: "fit-content",

          [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
            gridTemplateColumns: "40% 1fr",
            padding: "5px",
          },
          [`@media (min-width: ${theme.breakpoints.md}px)`]: {
            padding: 0,
          },
        }}
      >
        <Image
          src="https://i.imgur.com/BnIo6F3.jpg"
          height={600}
          alt="aboutImg"
        />
        <Stack
          align={"start"}
          justify="center"
          sx={{
            padding: "20px",
            [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
              padding: "0",
            },
          }}
        >
          <Title size={48}>About Us</Title>
          <Text
            sx={{
              fontSize: "16px",
              letterSpacing: "0.5px",
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
            tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
          </Text>
          <Text
            sx={{
              fontSize: "16px",
              letterSpacing: "0.5px",
              marginTop: "20px",
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
            tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
          </Text>

          <Text
            sx={{
              fontSize: "24px",
              fontFamily: "Dancing Script, sans-serif",
              letterSpacing: "0.1px",
            }}
          >
            Miriam Pierzak
          </Text>

          <Button rightIcon={<IconArrowRight size={14} />}>Contact Us</Button>
        </Stack>
      </SimpleGrid>
    </>
  );
};

export default AboutUs;
