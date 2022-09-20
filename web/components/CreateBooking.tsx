import { Stack, Button, NativeSelect } from "@mantine/core"
import { DatePicker, TimeInput } from "@mantine/dates"
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import createBooking from "../utils/createBooking"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import 'dayjs/locale/en-gb'
import { useRouter } from "next/router";
import { AlertState } from "../hooks/useAlert";
import me from "../utils/me";
import MapToDbName from "../utils/mapToDbName";



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
    const selectRef = useRef<HTMLSelectElement>(null);

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


        console.log(selectRef.current?.value)


        if (!date || !selectRef.current?.value) {
            handleSetAlertInfo(AlertState.failure, "Creating a booking failed, select a valid date.");
            return;
        }

        let lesson = MapToDbName(selectRef.current?.value);
        if (!lesson) {
            handleSetAlertInfo(AlertState.failure, "Creating a booking failed, invalid lesson type.");
            return;
        }

        let isoDate = dayjs(date).subtract(1, 'hour').format("YYYY-MM-DDTHH:mm:ss[Z]");


        let response = await createBooking({
            date: isoDate,
            lesson_type: lesson
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
                <NativeSelect
                    data={['One On One', 'Online (begginers)', 'Online (intermediate)', 'Private Online']}
                    placeholder="Pick a lesson type"
                    label="Lesson Type"
                    ref={selectRef}
                />
                <Button onClick={() => handleCreatingBooking()}>Create</Button>
            </Stack>
        </>
    )


}

export default CreateBooking