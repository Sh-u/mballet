import {
  Anchor,
  Group,
  Image,
  MantineTheme,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconCalendarEvent } from "@tabler/icons";
import dayjs from "dayjs";
import Link from "next/link";

interface NewsCardPreview {
  theme: MantineTheme;
  image?: string;
  title: string;
  body: string;
  date: string;
  id: number;
}

const NewsCardPreview = ({
  theme,
  title,
  body,
  image,
  date,
  id,
}: NewsCardPreview) => {
  return (
    <>
      <Stack
        sx={{
          width: "80%",
          boxShadow: "7px 8px 20px 0px rgba(206, 206, 206, 0.5)",
          backgroundColor: theme.colors.gray[2],
          padding: "20px",
          [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
            width: "32%",
          },
        }}
      >
        <Image
          src={
            image
              ? `/${image?.split("public/").pop()}`
              : "https://i.imgur.com/zF5dmaZ.jpg"
          }
          alt="newsImg1"
          height={200}
          styles={{
            image: {
              width: "100%",
              height: "350px",
              [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
                width: "32%",
                height: "200px",
              },
            },
          }}
        />
        <Group>
          <IconCalendarEvent size={16} />
          <Text>{dayjs(date).format("DD/MM/YYYY")}</Text>
        </Group>

        <Title>{title}</Title>
        <Text
          sx={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {body}
        </Text>

        <Link href={`/news/${id}`}>
          <Anchor
            component="a"
            sx={{
              "&:hover": {
                color: theme.colors.main[3],
              },
            }}
          >
            Learn more...
          </Anchor>
        </Link>
      </Stack>
    </>
  );
};

export default NewsCardPreview;
