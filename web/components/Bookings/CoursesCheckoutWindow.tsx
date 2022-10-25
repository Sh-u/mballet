import {
  Anchor,
  Divider,
  Group,
  MantineTheme,
  Stack,
  Text,
  Title,
} from "@mantine/core";

interface CheckoutWindowProps {
  theme: MantineTheme;
  course_name: string | string[] | undefined;
  sessions: number;
  coursePrice: string | null | number;
}

const CourseCheckoutWindow = ({
  theme,
  course_name,
  sessions,
  coursePrice,
}: CheckoutWindowProps) => {
  return (
    <Stack
      p="xl"
      sx={(theme) => ({
        border: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
        }`,
      })}
    >
      <Title>Order summary</Title>
      <Group position="apart">
        <Text size={"xl"}>Plan</Text>
        <Text size={"xl"}>{course_name}</Text>
      </Group>
      <Group position="apart">
        <Text size={"xl"}>Duration</Text>
        <Text size={"xl"}>Until canceled</Text>
      </Group>
      <Group position="apart">
        <Text size={"xl"}>Sessions</Text>
        <Text size={"xl"}>{sessions}</Text>
      </Group>
      <Divider />
      <Anchor>Enter coupon code</Anchor>
      <Divider />
      <Group position="apart">
        <Text size={"xl"}>Total</Text>
        <Text size={"xl"} weight="bold">
          {coursePrice}£
        </Text>
      </Group>
    </Stack>
  );
};

export default CourseCheckoutWindow;
