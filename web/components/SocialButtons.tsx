import { Button, ButtonProps, Group } from '@mantine/core';
import { IconBrandGoogle as GoogleIcon, IconBrandFacebook as FacebookIcon } from '@tabler/icons';


type GoogleButtonProps = {
    clickHandler: () => void
}

export const GoogleButton = ({ clickHandler, ...props }: ButtonProps & GoogleButtonProps) => {

    return <Button onClick={async () => clickHandler()} leftIcon={<GoogleIcon />} color="red" {...props} />;
}


export const FacebookButton = (props: ButtonProps) => {
    return (
        <Button
            leftIcon={<FacebookIcon />}
            radius={props.radius}
            color='blue'
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
}