import {
  Stack,
  Group,
  Title,
  Button,
  Box,
  Text,
  MantineTheme,
} from "@mantine/core";
import { IconArrowRight } from "@tabler/icons";

import Link from "next/link";
import React from "react";
import { Post } from "../types";
import NewsCardPreview from "./NewsCardPreview";

interface NewsProps {
  theme: MantineTheme;
  posts: Post[];
}

const News = ({ theme, posts }: NewsProps) => {
  return (
    <>
      <Box
        data-aos="fade"
        sx={{
          backgroundColor: theme.colors.gray[0],
        }}
      >
        <Stack
          p="20px"
          sx={{
            maxWidth: "70rem",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "20px",
            [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
              padding: "20px 0 20px 0",
            },
          }}
        >
          <Group
            sx={{
              flexWrap: "wrap",
              flexDirection: "column",
              [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
                flexDirection: "row",
                justifyContent: "space-between",
                padding: "20px",
              },
              [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
                padding: 0,
              },
            }}
          >
            <Stack>
              <Title
                sx={{
                  textAlign: "center",
                  [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
                    textAlign: "unset",
                    fontSize: "48px",
                  },
                }}
              >
                News
              </Title>
              <Text
                sx={{
                  textAlign: "center",

                  [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
                    textAlign: "unset",
                  },
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
                tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
              </Text>
            </Stack>

            <Link href="/news">
              <Button component="a" rightIcon={<IconArrowRight size={14} />}>
                Learn more
              </Button>
            </Link>
          </Group>

          <Group
            sx={{
              flexWrap: "wrap",
              justifyContent: "center",
              [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
                flexWrap: "nowrap",
                justifyContent: "unset",
              },
            }}
          >
            {posts.map((post) => (
              <NewsCardPreview
                id={post.id}
                title={post.title}
                body={post.body}
                date={post.created_at}
                image={post.img}
                key={post.id}
                theme={theme}
              />
            ))}
          </Group>
        </Stack>
      </Box>
    </>
  );
};

export default News;
