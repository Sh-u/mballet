import {
  Button,
  Divider,
  FileButton,
  Group,
  MantineTheme,
  Modal,
  Space,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
import { IconPhoto } from "@tabler/icons";

import { Form, Formik } from "formik";
import { useState } from "react";
import { Post } from "../types";
import updatePost from "../utils/updatePost";

interface EditPostModalProps {
  refreshData: () => void;
  editModalOpen: boolean;
  setEditModalOpen: (v: boolean) => void;
  post: Post;
  theme: MantineTheme;
}

const EditPostModal = ({
  refreshData,
  post,
  editModalOpen,
  setEditModalOpen,
  theme,
}: EditPostModalProps) => {
  const [file, setFile] = useState<File | null>(null);

  console.log(post.id);
  return (
    <>
      <Modal
        overlayOpacity={0.2}
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
      >
        <Formik
          initialValues={{
            title: post?.title ?? "",
            body: post?.body ?? "",
            published: true,
          }}
          onSubmit={async (values, actions) => {
            console.log(JSON.stringify(values));
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

            if ((await updatePost(post.id, body)).status === 200) {
              console.log("success");

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
          {({ isSubmitting, errors, values, handleChange }) => (
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
                  <FileButton onChange={setFile} accept="image/png,image/jpeg">
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
                      <span>Update</span>
                    </Button>
                  )}
                </Group>
              </Form>
            </Stack>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default EditPostModal;
