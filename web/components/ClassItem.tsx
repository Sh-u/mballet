import { Button, Group, MantineTheme, Stack, Text, Title } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons";
import Link from "next/link";

interface ClassItemProps {
  theme: MantineTheme;
  price: string;
  title: string;
  body: string;
  href: string;
}

const ClassItem = ({ theme, price, title, body, href }: ClassItemProps) => {
  return (
    <>
      <Stack
        p="lg"
        justify="center"
        align="center"
        sx={{
          backgroundColor: theme.colors.gray[2],
          width: "80%",
          [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
            width: "32%",
          },

          height: "350px",
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

        <Text align="center">{body}</Text>
        <Link href={href} passHref>
          <Button component="a" rightIcon={<IconArrowRight size={14} />}>
            Book now
          </Button>
        </Link>
      </Stack>
    </>
  );
};

export default ClassItem;
