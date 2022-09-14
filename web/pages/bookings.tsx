import { Box, Button, Center, Divider, Grid, Group, Loader, Stack, Text, useMantineTheme, Notification, SimpleGrid } from "@mantine/core";
import { Calendar, DatePicker, TimeInput } from "@mantine/dates";
import { useMediaQuery } from "@mantine/hooks";
import { IconArrowBack, IconCheck } from "@tabler/icons";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import CreateBooking from "../components/CreateBooking";
import useAlert, { UseAlertProps } from "../hooks/useAlert";
import book from "../utils/book";
import getAllAvailableBookings from "../utils/getAllAvailableBookings";


interface TimeButton {
    time: string
    index: number
}

export interface Booking {
    id: string | number,
    booked_at: string,
    booked_by: number | null,
    created_at: string
}

enum AlertState {
    success,
    failure
}



const bookings = () => {
    const [value, setValue] = useState<any>(null);

    const [time, setTime] = useState<TimeButton | null>(null);

    const [bookings, setBookings] = useState<Booking[]>([]);

    const [loading, setLoading] = useState(true);

    const [alertInfo, setAlertInfo] = useState<UseAlertProps>({
        type: null,
        message: ""
    });

    const alert = useAlert(alertInfo);

    const router = useRouter();



    const handleSetAlertInfo = (type: AlertState, message: string) => {
        console.log('handleAlertInfoState')
        if (alertInfo.type === null) {
            console.log('setting Alert info', alertInfo)
            setAlertInfo({
                type: type,
                message: message
            });
        }
    };

    const handleSubmitBook = async () => {



        if (!time || !bookings) {
            handleSetAlertInfo(AlertState.failure, "Booking failed, please select a valid date first.");
            return;
        }

        let response = await book({
            booking_id: bookings[time.index].id as number
        });

        if (response.status !== 200) {
            let error = await response.json();
            handleSetAlertInfo(AlertState.failure, error.message);
            return;
        }

        let booking = await response.json();
        handleSetAlertInfo(AlertState.success, booking.message);


    }

    useEffect(() => {

        if (alertInfo.type === null) {
            return;
        }
        const timer = setTimeout(() => {
            setAlertInfo({
                type: null,
                message: ""
            })
        }, 3000);

        return () => clearTimeout(timer);
    }, [alertInfo])

    const theme = useMantineTheme();
    useEffect(() => {

        const getHours = async () => {
            const response = await getAllAvailableBookings();

            if (response.status !== 200) {
                return;
            }
            let bookings_response = await response.json();

            setBookings(bookings_response);


        }

        getHours().catch(console.error)
        setLoading(false);
    }, [])

    useEffect(() => {
        setTime(null)
    }, [value])



    if (loading) {
        return (
            <Center mt='6rem'>
                <Loader size='xl' />
            </Center>

        )
    }




    return (
        <>
            <Group mt='2rem' sx={{
                justifyContent: 'space-evenly',
                position: 'relative',




            }}>



                <Stack align='start' justify='center' sx={{
                    width: '100%',
                    marginLeft: '0px',

                    paddingLeft: '1rem',
                    paddingRight: '1rem',


                    [`@media (min-width: ${theme.breakpoints.md}px)`]: {
                        width: 800,
                        padding: 0
                    },

                    [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
                        paddingLeft: '2rem',
                        paddingRight: '2rem',
                    },



                }} >
                    <Button leftIcon={<IconArrowBack />} color='cyan' variant="default" >Back</Button>
                    <Text size='xl' align="left">London time (GMT +01:00)</Text>


                    <Calendar
                        value={value}
                        onChange={setValue}
                        fullWidth
                        size="xl"

                        dayStyle={(date: Date) => date.getDate() === value?.getDate() ? {
                            backgroundColor: theme.colors.dark[4]
                        } as CSSProperties : {

                        }}
                        excludeDate={(date) => {
                            return !bookings?.some(booking => dayjs(booking.booked_at).format('YYYY-MM-DD') === dayjs(date).format('YYYY-MM-DD'));

                        }}
                        styles={(theme) => ({
                            cell: {
                                border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
                                    }`,

                            },
                            calendarBase: {
                            },
                            day: {
                                [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
                                    height: 70,

                                }, borderRadius: 0, height: 50, fontSize: theme.fontSizes.lg
                            },
                            weekday: { fontSize: theme.fontSizes.lg, fontWeight: 'bold' },
                            weekdayCell: {
                                fontSize: theme.fontSizes.xl,
                                backgroundColor:
                                    theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
                                border: `2px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
                                    }`,
                                height: 60,
                                [`@media (min-width: ${theme.breakpoints.md}px)`]: {
                                    height: 70,

                                }
                            },
                        })}
                    />



                    <SimpleGrid sx={{

                        margin: '0',
                        padding: '0',
                        gap: '16px',
                        gridAutoFlow: 'column',
                        gridTemplateRows: 'repeat(3, auto)',
                        justifyContent: 'start',
                    }}>

                        {bookings?.map((booking, index) => {

                            const bookedAt = dayjs(new Date(Date.parse(booking.booked_at))).add(1, 'hour');
                            if (bookedAt.format('YYYY-MM-DD') !== dayjs(value).format('YYYY-MM-DD')) {
                                return null;
                            }
                            let minutes = bookedAt.format('mm');
                            let newTime = `${bookedAt.hour()}:${minutes}`;


                            // console.log('bookedat', booking.booked_at)
                            return (<Box onClick={() => {
                                setTime({
                                    time: newTime,
                                    index: index
                                })

                            }} key={index} sx={(theme) => ({
                                width: '150px',
                                border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
                                    }`,
                                padding: theme.spacing.xs,
                                backgroundColor: time?.index === index ? theme.colors.dark[4] : '-moz-initial',
                                color: time?.index === index ? 'white' : '-moz-initial',
                                cursor: 'pointer',
                                '&:hover': {
                                    backgroundColor: theme.colors.dark[4],
                                    color: 'white'
                                }
                            })}>{newTime}</Box >
                            )
                        })}



                    </SimpleGrid >



                </Stack >


                <Stack sx={{
                    position: 'relative',



                }}>
                    <Stack p='xl' sx={(theme) => ({

                        border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
                            }`,
                    })}>
                        <Text size={'xl'} weight='bold'  >1 on 1 Ballet Lesson</Text>
                        <Text size={'md'}  >1hr | 50$</Text>
                        <Divider />
                        <Box >
                            <Text size={'lg'}  >
                                {value?.toDateString()}</Text>
                            <Text size={'lg'} >
                                {time?.time}
                            </Text>
                        </Box>

                        <Button variant="light" onClick={() => handleSubmitBook()}>Book</Button>



                    </Stack>

                    <CreateBooking handleAddBooking={(booking) => {


                        console.log('create booking: ', booking)
                        const bookings2 = [...bookings, booking].sort((a, b) => {
                            if (dayjs(a.booked_at).isBefore(b.booked_at)) return -1;
                            else if (dayjs(a.booked_at).isAfter(b.booked_at)) return 1;
                            else return 0;
                        });
                        setBookings(bookings2);
                    }} handleSetAlertInfo={handleSetAlertInfo} />
                    {alert}
                </Stack>


            </Group>

        </>
    );
}

export default bookings