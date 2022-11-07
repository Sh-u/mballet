import {
  Button,
  CloseButton,
  Divider,
  FileButton,
  Group,
  MantineTheme,
  Space,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
import { IconPhoto } from "@tabler/icons";
import { Form, Formik } from "formik";
import { useState } from "react";
import { PostInfo } from "../../types";
import createPost from "../../utils/createPost";

interface CreatePostProps {
  refreshData: () => void;
  post?: PostInfo;
  theme: MantineTheme;
}

const CreatePost = ({ refreshData, theme }: CreatePostProps) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  return (
    <>
      {open ? (
        <Stack
          p={"lg"}
          mt={"lg"}
          mx={"auto"}
          sx={{
            width: "100%",
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            padding: "6px",
          }}
          align="end"
          spacing={"lg"}
        >
          <CloseButton
            title="closePost"
            size="md"
            iconSize={20}
            onClick={() => setOpen(false)}
          />

          <Formik
            initialValues={{
              title: "",
              body: "",
              published: true,
            }}
            onSubmit={async (values, actions) => {
              if (values.title.length < 3) {
                actions.setFieldError("title", "The title is too short!");
                return;
              }
              if (values.body.length < 5) {
                actions.setFieldError("body", "The body is too short!");
                return;
              }

              const body = new FormData();

              body.append("title", values.title);
              body.append("body", values.body);

              body.append("published", "t");

              if (file) {
                body.append("image", file);
              }

              if ((await createPost(body)).status === 200) {
                actions.setSubmitting(false);
                actions.setValues({
                  title: "",
                  body: "",
                  published: false,
                });
                refreshData();
              } else {
                console.log("error");

                return;
              }
            }}
          >
            {({ isSubmitting, values, handleChange, errors }) => (
              <Stack spacing={"xl"} sx={{ width: "100%" }}>
                <Form>
                  <Textarea
                    size="lg"
                    placeholder="Place your title here!"
                    autosize
                    variant="unstyled"
                    value={values.title}
                    onChange={handleChange}
                    aria-label="Title"
                    id="title"
                    name="title"
                    error={errors.title}
                  />
                  <Divider
                    my="lg"
                    sx={{
                      margin: "0 !important",
                    }}
                  />
                  <Textarea
                    size="lg"
                    sx={{ height: "50%" }}
                    placeholder="Place post content here!"
                    autosize
                    variant="unstyled"
                    value={values.body}
                    onChange={handleChange}
                    aria-label="Body"
                    id="body"
                    name="body"
                    error={errors.body}
                  />
                  <Divider
                    my="lg"
                    sx={{
                      margin: "0 !important",
                    }}
                  />

                  <Space h="md" />

                  <Group position="apart">
                    <FileButton
                      onChange={setFile}
                      accept="image/png,image/jpeg"
                    >
                      {(props) => (
                        <IconPhoto size={32} cursor="pointer" {...props}>
                          Upload image
                        </IconPhoto>
                      )}
                    </FileButton>

                    {file && (
                      <Text size="sm" align="center">
                        Picked file: {file.name}
                      </Text>
                    )}
                    {isSubmitting ? (
                      <Button disabled>
                        <span>Create</span>
                      </Button>
                    ) : (
                      <Button type="submit">
                        <span>Create</span>
                      </Button>
                    )}
                  </Group>
                </Form>
              </Stack>
            )}
          </Formik>
        </Stack>
      ) : (
        <Group position="center" mt="lg">
          <Button onClick={() => setOpen(true)}>Create Post</Button>
        </Group>
      )}
    </>
  );
};

export default CreatePost;
