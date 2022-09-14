import { Stack, Button } from "@mantine/core"
import { DatePicker, TimeInput } from "@mantine/dates"
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import createBooking from "../utils/createBooking"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import 'dayjs/locale/en-gb'
import { useRouter } from "next/router";
import { AlertState } from "../hooks/useAlert";
import me from "../utils/me";



interface Booking {
    id: string | number,
    booked_at: string,
    booked_by: number | null,
    created_at: string
}
interface CreateBookingProps {
    handleSetAlertInfo: (type: AlertState, message: string) => void;
    handleAddBooking: (booking: Booking) => void;

}

const CreateBooking = ({ handleSetAlertInfo, handleAddBooking }: CreateBookingProps) => {


    const [render, setRender] = useState(false);
    const [date, setDate] = useState<Date | null>(new Date());

    useEffect(() => {
        const checkAdmin = async () => {
            const response = await me();

            const user = await response.json();


            if (user.is_admin) {
                setRender(true)
            }
        }


        checkAdmin().catch(console.error)
    }, [])

    if (!render) {
        return null
    }





    const handleCreatingBooking = async () => {



        if (!date) {
            handleSetAlertInfo(AlertState.failure, "Creating a booking failed, select a valid date.");
            return;
        }


        let isoDate = dayjs(date).subtract(1, 'hour').format("YYYY-MM-DDTHH:mm:ss[Z]");

        let response = await createBooking({
            date: isoDate,
            user_id: 1
        });

        if (response.status !== 200) {
            let error = await response.json();
            handleSetAlertInfo(AlertState.failure, error.message);
            return;
        }

        let booking: Booking = await response.json();

        handleSetAlertInfo(AlertState.success, "Created a booking successfuly");
        handleAddBooking(booking);

    }


    return (
        <>
            <Stack>
                <DatePicker label="Date" value={date} onChange={setDate} clearable={false} />
                <TimeInput label="Time" value={date} onChange={(value) => {
                    console.log('d', value)
                    const d = date;
                    d?.setHours(value.getHours());
                    d?.setMinutes(value.getMinutes());
                    setDate(d)
                }} />
                <Button onClick={() => handleCreatingBooking()}>Create</Button>
            </Stack>
        </>
    )


}

export default CreateBooking