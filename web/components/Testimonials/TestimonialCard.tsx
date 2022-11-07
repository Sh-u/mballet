import { Avatar, Stack, Text, Title, useMantineTheme } from "@mantine/core";
import { motion } from "framer-motion";
import { ImQuotesRight } from "react-icons/im";

interface TestimonialCardProps {
  name: string;
  description: string;
  body: string;
  visible: string;
  position: number;
}

const TestimonialCard = ({
  name,
  description,
  body,
  visible,
  position,
}: TestimonialCardProps) => {
  console.log("position", position);
  const theme = useMantineTheme();

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
            maxWidth: "100%",
            borderRadius: "16px",
            padding: "20px",
            position: "relative",
            margin: "auto",
            [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
              maxWidth: "70%",
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
            p="10px"
            sx={{
              fontSize: "18px",
              textAlign: "center",
              fontStyle: "italic",
              color: theme.colors.gray[7],
            }}
          >
            {body}
          </Text>
          <ImQuotesRight size={32} />
        </Stack>
      </motion.div>
    </>
  );
};

export default TestimonialCard;
