import { Button, Group, MantineTheme, Stack, Title, Text, Divider } from "@mantine/core"
import { IconArrowRight, IconSquareCheck } from "@tabler/icons"
import { useRouter } from "next/router"

interface LessonCardProps {
    theme: MantineTheme,
    onTop: boolean,
    title: string,
    price: string,
    body: string,
    checks: string,
    url: string,
}
const LessonCard = ({ theme, onTop, title, price, body, checks, url }: LessonCardProps) => {
    const router = useRouter();
    return (
        <>
            <Stack align='center' sx={{
                backgroundColor: theme.colors.gray[2],
                padding: '30px 10px',
                width: '80%',
                height: '465px',
                [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
                    height: onTop ? '525px' : '465px',
                    width: '33%',
                    padding: '50px 30px',
                    boxShadow: onTop ? '0px 10px 45px -5px rgb(0 0 0 / 14%);' : 'unset',
                    transform: onTop ? 'translateY(-10px)' : 'unset'
                }
            }}>
                <Title>{title}</Title>
                <Group sx={{
                    gap: 2
                }}>
                    <Title sx={{
                        fontSize: '64px'
                    }} >{price}</Title>
                    <Title order={4}> / hour</Title>
                </Group>

                <Text sx={{
                    textAlign: 'center'
                }}>{body}</Text>
                <Group>
                    <IconSquareCheck />
                    <Text size={16}>{checks}</Text>
                </Group>

                <Group>
                    <IconSquareCheck />
                    <Text size={16}>{checks}</Text>
                </Group>



                <Button onClick={() => router.push(`/bookings?lesson=${url}`)} rightIcon={<IconArrowRight size={14} />} radius={'xs'} styles={{
                    root: {
                        backgroundColor: 'unset',
                        color: 'black',
                        border: '2px black solid',
                        height: '50px',
                    },

                }} sx={{
                    marginTop: 'auto',
                    fontSize: '14px',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 'normal',
                    '&:hover': {
                        transition: '0.2s ease-in-out',
                        backgroundColor: theme.colors.gray[9],
                        color: 'white',
                    },
                }}>
                    Book now
                </Button>
            </Stack>
        </>
    )
}

export default LessonCard