import { Stack, Group, Title, Anchor, Image, Text, MantineTheme } from "@mantine/core"
import { IconCalendarEvent, IconArrowRight } from "@tabler/icons"

interface NewsCardPreview {
    theme: MantineTheme
}

const NewsCardPreview = ({ theme }: NewsCardPreview) => {
    return (
        <>
            <Stack sx={{
                maxWidth: '80%',

                backgroundColor: theme.colors.gray[3],
                padding: '20px',
                [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
                    maxWidth: '32%',
                }
            }}>
                <Image src={'https://i.imgur.com/zF5dmaZ.jpg'} alt='newsImg1' sx={{
                    width: '100%'
                }} height={200} />
                <Group>
                    <IconCalendarEvent size={16} />
                    <Text> July 19, 2022</Text>
                </Group>

                <Title>Dance steps to success</Title>
                <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</Text>


                <Anchor sx={{
                    '&:hover': {
                        color: theme.colors.main[3]
                    }
                }}>
                    Learn more...
                </Anchor>



            </Stack>
        </>
    )
}

export default NewsCardPreview