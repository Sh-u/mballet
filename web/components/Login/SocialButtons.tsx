import { Button, ButtonProps } from "@mantine/core";
import {
  IconBrandFacebook as FacebookIcon,
  IconBrandGoogle as GoogleIcon,
} from "@tabler/icons";

type GoogleButtonProps = {
  clickHandler: () => void;
  red: string;
};

export const GoogleButton = ({
  clickHandler,
  red,
  ...props
}: ButtonProps & GoogleButtonProps) => {
  return (
    <Button
      onClick={async () => clickHandler()}
      leftIcon={<GoogleIcon />}
      // sx={{
      //   backgroundColor: red,
      //   color: "white",

      //   "&:hover": {
      //     backgroundColor: "white",
      //     color: "black",
      //   },
      // }}
      {...props}
    />
  );
};

export const FacebookButton = (props: ButtonProps) => {
  return (
    <Button
      leftIcon={<FacebookIcon />}
      radius={props.radius}
      color="blue"
      // sx={(theme) => ({
      //     backgroundColor: '#4267B2',

      //     color: '#fff',
      //     '&:hover': {
      //         backgroundColor: theme.fn.darken('#4267B2', 0.1),
      //     },
      // })}
    >
      {props.children}
    </Button>
  );
};
