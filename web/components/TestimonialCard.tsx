import { Avatar, MantineTheme, Stack, Text, Title } from "@mantine/core";
import { IconQuote } from "@tabler/icons";
import { motion } from "framer-motion";

interface TestimonialCardProps {
  theme: MantineTheme;
  name: string;
  description: string;
  body: string;
  visible: string;
  position: number;
}

const TestimonialCard = ({
  theme,
  name,
  description,
  body,
  visible,
  position,
}: TestimonialCardProps) => {
  console.log("position", position);

  return (
    <>
      <motion.div
        id={name}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 30,
        }}
        style={{
          display: visible,
        }}
      >
        <Stack
          align={"center"}
          sx={{
            backgroundColor: theme.colors.gray[1],
            maxWidth: "80%",
            borderRadius: "16px",
            padding: "20px",
            position: "relative",
            margin: "auto",
            [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
              maxWidth: "60%",
            },
          }}
        >
          <Avatar
            radius="xl"
            size={"xl"}
            sx={{ position: "absolute", top: "-40px" }}
          />
          <Title
            sx={{
              marginTop: "15%",
              [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
                marginTop: "5%",
              },
            }}
          >
            {name}
          </Title>
          <Text
            sx={{
              fontWeight: "bold",
            }}
          >
            {description}
          </Text>

          <Text
            sx={{
              fontSize: "16px",
              textAlign: "center",
              fontStyle: "italic",
              color: theme.colors.gray[7],
            }}
          >
            {body}
          </Text>
          <IconQuote size={64} />
        </Stack>
      </motion.div>
    </>
  );
};

export default TestimonialCard;
