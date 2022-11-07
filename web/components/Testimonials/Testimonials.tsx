import { ActionIcon, Group, MantineTheme, Stack, Title } from "@mantine/core";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons";
import { Dispatch, SetStateAction } from "react";

interface Testimonials {
  theme: MantineTheme;
  testimonials: JSX.Element[];
  currentTestimonial: number;
  setCurrentTestimonial: Dispatch<SetStateAction<number>>;
}

const Testimonials = ({
  theme,
  testimonials,
  currentTestimonial,
  setCurrentTestimonial,
}: Testimonials) => {
  return (
    <>
      <Stack
        data-aos="fade"
        id="testimonials"
        mt={"30px"}
        align="center"
        p="20px"
        sx={{
          width: "100%",
          backgroundColor: theme.colors.gray[0],
        }}
      >
        <Title size={"48px"}>Our Satisfied Clients</Title>

        <Group
          sx={{
            marginTop: "20px",
            flexWrap: "nowrap",
            justifyContent: "space-around",
          }}
        >
          <ActionIcon
            sx={{ zIndex: 1 }}
            onClick={() => {
              if (currentTestimonial - 1 < 0) {
                return;
              }

              setCurrentTestimonial(currentTestimonial - 1);
            }}
          >
            <IconArrowLeft size={32} />
          </ActionIcon>

          {testimonials[currentTestimonial]}

          <ActionIcon
            sx={{ zIndex: 1 }}
            onClick={() => {
              if (currentTestimonial + 1 >= 2) {
                return;
              }

              setCurrentTestimonial(currentTestimonial + 1);
            }}
          >
            <IconArrowRight size={32} />
          </ActionIcon>
        </Group>
      </Stack>
    </>
  );
};

export default Testimonials;
