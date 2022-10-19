import {
  Box,
  Button,
  Image,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconArrowRight } from "@tabler/icons";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Footer from "../../components/Footer";
import MainContentWrapper from "../../components/MainContentWrapper";
import Navbar from "../../components/Navbar";
import { Posts } from "../../types";
import { defaultNewsImage } from "../../utils/defaultNewsImage";
import getOnePost from "../../utils/getOnePost";

const FullPostPage = (props: Posts) => {
  const router = useRouter();
  const theme = useMantineTheme();
  console.log(props);

  return (
    <>
      <Navbar theme={theme} />
      <MainContentWrapper theme={theme}>
        <Stack
          sx={{
            maxWidth: "70rem",
            margin: "30px auto auto auto",
          }}
        >
          <Button
            rightIcon={<IconArrowRight size={14} />}
            onClick={() => router.back()}
            sx={{
              width: "fit-content",
            }}
          >
            Back
          </Button>
          <Title
            sx={{
              fontSize: "60px",
            }}
          >
            {props.title}
          </Title>
          <Image
            width={"70rem"}
            height={"40rem"}
            alt={props.title}
            src={
              props.img
                ? `/${props.img.split("public/").pop()}`
                : defaultNewsImage
            }
          />
          <Text>{props.body}</Text>
        </Stack>
      </MainContentWrapper>
      <Footer theme={theme} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  let id = context?.query?.id as string;

  console.log("id:", id);
  if (!id) {
    return {
      notFound: true,
    };
  }

  let response = await getOnePost(id);

  if (response.status !== 200) {
    console.log("no confirmation");
    return {
      notFound: true,
    };
  }

  const props = await response.json();

  return {
    props: props,
  };
};

export default FullPostPage;
