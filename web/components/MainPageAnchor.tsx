import { Anchor, MantineTheme } from "@mantine/core";
import React from "react";


interface MainPageAnchorProps {
    theme: MantineTheme,
    children: string,
    href: string,
}

const MainPageAnchor: React.FC<MainPageAnchorProps> = ({ theme, children, href }) => {


    return (
        <>
            <Anchor href={href} variant='text' sx={{
                color: theme.colors.gray[2],
                fontWeight: 'normal',
                padding: '10px',
                '&:hover': {
                    backgroundColor: theme.colors.gray[2],
                    color: theme.colors.dark[5],
                    padding: '10px'
                }
            }}>{children}</Anchor>
        </>
    )
}

export default MainPageAnchor;