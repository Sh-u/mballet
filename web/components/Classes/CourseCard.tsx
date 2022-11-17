import { Button, Group, MantineTheme, Stack, Text, Title } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons";
import { useRouter } from "next/router";
import { BsFillCheckSquareFill } from "react-icons/bs";
interface CourseCardProps {
  theme: MantineTheme;
  onTop: boolean;
  title: string;
  price: string;
  body: string;
  checks: string[];
  url: string;
  oldPrice?: string;
  soldOut?: boolean;
}
const CourseCard = ({
  theme,
  onTop,
  title,
  price,
  body,
  checks,
  url,
  oldPrice,
  soldOut,
}: CourseCardProps) => {
  const router = useRouter();
  return (
    <>
      <Stack
        align="center"
        justify={"space-evenly"}
        sx={{
          backgroundColor: theme.colors.gray[2],
          padding: "40px 20px",
          width: "80%",
          height: "max-content",
          gap: "12px",
          [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
            height: onTop ? "525px" : "465px",
            width: "33%",
            padding: "20px",
            boxShadow: onTop ? "0px 10px 45px -5px rgb(0 0 0 / 14%);" : "unset",
            transform: onTop ? "translateY(-10px)" : "unset",
          },
        }}
      >
        <Title
          sx={{
            textAlign: "center",
          }}
        >
          {title}
        </Title>
        <Group
          sx={{
            gap: 2,
          }}
        >
          <Title color={theme.colors.red[9]} strikethrough>
            {oldPrice}
          </Title>
          <Title
            sx={{
              fontSize: "64px",
            }}
          >
            {price}
          </Title>
        </Group>

        <Text
          sx={{
            textAlign: "center",
          }}
        >
          {body}
        </Text>

        <Stack align={"start"}>
          {checks.map((check) => (
            <Group key={check}>
              <BsFillCheckSquareFill size={14} />

              <Text>{check}</Text>
            </Group>
          ))}
        </Stack>

        <Button
          sx={{
            minWidth: "120px",
          }}
          onClick={() => router.push(`/courses?course=${url}`)}
          rightIcon={soldOut ? null : <IconArrowRight size={14} />}
          disabled={soldOut}
        >
          {soldOut ? "Sold Out" : "Book Now"}
        </Button>
      </Stack>
    </>
  );
};

export default CourseCard;
