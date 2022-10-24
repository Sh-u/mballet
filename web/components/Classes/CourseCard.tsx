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
}
const CourseCard = ({
  theme,
  onTop,
  title,
  price,
  body,
  checks,
  url,
}: CourseCardProps) => {
  const router = useRouter();
  return (
    <>
      <Stack
        align="center"
        justify={"space-evenly"}
        sx={{
          backgroundColor: theme.colors.gray[2],
          padding: "30px 10px",
          width: "80%",
          height: "465px",
          [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
            height: onTop ? "525px" : "465px",
            width: "33%",
            padding: "50px 30px",
            boxShadow: onTop ? "0px 10px 45px -5px rgb(0 0 0 / 14%);" : "unset",
            transform: onTop ? "translateY(-10px)" : "unset",
          },
        }}
      >
        <Title>{title}</Title>
        <Group
          sx={{
            gap: 2,
          }}
        >
          <Title
            sx={{
              fontSize: "64px",
            }}
          >
            {price}
          </Title>
          <Title order={4}> / hour</Title>
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
          onClick={() => router.push(`/bookings?lesson=${url}`)}
          rightIcon={<IconArrowRight size={14} />}
        >
          Book now
        </Button>
      </Stack>
    </>
  );
};

export default CourseCard;
