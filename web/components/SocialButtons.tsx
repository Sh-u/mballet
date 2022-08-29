import { Button, ButtonProps, Group } from '@mantine/core';
import { IconBrandGoogle as GoogleIcon, IconBrandFacebook as FacebookIcon } from '@tabler/icons';



export const GoogleButton = (props: ButtonProps) => {

    return <Button leftIcon={<GoogleIcon />} color="red" {...props} />;
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