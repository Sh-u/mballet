import {
  Anchor,
  Box,
  Button,
  Center,
  Container,
  createStyles,
  Group,
  Notification,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconArrowLeft, IconCheck } from "@tabler/icons";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useState } from "react";
import confirmReset from "../../utils/confirmReset";
import reset from "../../utils/reset";

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: 26,
    fontWeight: 900,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  controls: {
    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column-reverse",
    },
  },

  control: {
    [theme.fn.smallerThan("xs")]: {
      width: "100%",
      textAlign: "center",
    },
  },
}));

interface ForgotPasswordProps {
  type: string;
  uuid?: string;
}

export function ForgotPassword(props: ForgotPasswordProps) {
  const { classes } = useStyles();
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      if (props.type === "password") {
        console.log("pass, uuid: ", props.uuid);

        if (!props.uuid) {
          return;
        }

        if (values.password.length < 4) {
          formik.setErrors({
            password: "Invalid Password.",
          });
          return;
        }

        let response = await confirmReset(
          {
            uuid: props.uuid,
          },
          {
            password: values.password,
          }
        );

        if (response.status !== 200) {
          let err = await response.json();

          formik.setErrors({
            password: err.message,
          });
          return;
        }
        router.push("/");
      } else {
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
          formik.setErrors({
            email: "Invalid email address",
          });
          return;
        }

        let response = await reset(values);

        if (response.status !== 200) {
          let err = await response.json();

          formik.setErrors({
            email: err.message,
          });
          return;
        }
        setSuccess(!success);
        formik.resetForm();
      }
    },
  });
  return (
    <>
      <Container
        size={400}
        mt={200}
        sx={{
          position: "relative",
        }}
      >
        <Title className={classes.title} align="center">
          {props.type === "password" ? (
            <Text>Reset your password.</Text>
          ) : (
            <Text>Forgot your password?</Text>
          )}
        </Title>
        <Text color="dimmed" size="sm" align="center">
          Enter your new password.
        </Text>

        <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
          <form onSubmit={formik.handleSubmit}>
            {props.type === "password" ? (
              <PasswordInput
                label="Your new password"
                type="password"
                name="password"
                id="password"
                placeholder="Your new password"
                required
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.errors.password}
              />
            ) : (
              <TextInput
                label="Your email"
                type="email"
                name="email"
                id="email"
                placeholder="your@email.com"
                required
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.errors.email}
              />
            )}

            <Group position="apart" mt="lg" className={classes.controls}>
              <Anchor color="dimmed" size="sm" className={classes.control}>
                <Center inline>
                  <IconArrowLeft size={12} stroke={1.5} />
                  <Box ml={5} onClick={() => router.back()}>
                    Back to login page
                  </Box>
                </Center>
              </Anchor>
              <Button className={classes.control} type="submit">
                {" "}
                {props.type === "password" ? (
                  <Text>Change Password</Text>
                ) : (
                  <Text>Send Link</Text>
                )}
              </Button>
            </Group>
          </form>
        </Paper>

        {/* <Button onClick={() => setSuccess(!success)}>open</Button> */}

        {success ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Notification
              onClose={() => setSuccess(false)}
              sx={{
                width: "fit-content",
                height: "fit-content",
                position: "absolute",
                left: "0",
                right: "0",
                top: "0",
                bottom: "0",
                margin: "auto",
                transform: "translateY(250px)",
              }}
              icon={<IconCheck size={18} />}
              color="teal"
              title="Success"
            >
              Mail sent.
            </Notification>
          </motion.div>
        ) : null}
      </Container>
    </>
  );
}
