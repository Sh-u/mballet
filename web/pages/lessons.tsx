import { Badge, Button, Card, Group, Text, Image } from "@mantine/core"
import { useRouter } from "next/router"

const Lessons = () => {

    const router = useRouter();
    return (
        <>
            <Group position="center">
                <Card shadow="sm" p="lg" radius="md" withBorder sx={{
                    maxWidth: '300px'
                }}>
                    <Card.Section>
                        <Image
                            src="https://i.imgur.com/eDuMeCL.jpeg"
                            height={160}
                            alt="OneOnOne"
                        />
                    </Card.Section>
                    <Group position="apart" mt="md" mb="xs">
                        <Text weight={500}>One on One</Text>
                        <Badge color="pink" variant="light">
                            On Sale
                        </Badge>
                    </Group>

                    <Text size="sm" color="dimmed">
                        Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
                    </Text>
                    <Button variant="light" color="blue" fullWidth mt="md" radius="md" onClick={() => router.push('/bookings?lesson=OneOnOne')}>
                        Book lesson now
                    </Button>
                </Card>


                <Card shadow="sm" p="lg" radius="md" withBorder sx={{
                    maxWidth: '300px'
                }}>
                    <Card.Section>
                        <Image
                            src="https://i.imgur.com/zZZNXW9.png"
                            height={160}
                            alt="OnlineBeginners"
                        />
                    </Card.Section>
                    <Group position="apart" mt="md" mb="xs">
                        <Text weight={500}>Online (Beginners)</Text>
                        <Badge color="pink" variant="light">
                            On Sale
                        </Badge>
                    </Group>

                    <Text size="sm" color="dimmed">
                        Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
                    </Text>
                    <Button variant="light" color="blue" fullWidth mt="md" radius="md" onClick={() => router.push('/bookings?lesson=OnlineBeginners')}>
                        Book lesson now
                    </Button>
                </Card>
            </Group>
        </>
    )
}

export default Lessons