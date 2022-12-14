import { Button, NativeSelect, Stack } from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";
import { useEffect, useRef, useState } from "react";
import { AlertState } from "../../hooks/useAlert";
import { BalletClass } from "../../pages/bookings";
import MapToDbName from "../../utils/mapToDbName";
import me from "../../utils/me";
import createClass from "../../utils/requests/bookings/createClass";

interface CreateClassProps {
  handleSetAlertInfo: (type: AlertState, message: string) => void;
  handleAddBooking: (booking: BalletClass) => void;
}

const CreateClass = ({
  handleSetAlertInfo,
  handleAddBooking,
}: CreateClassProps) => {
  const [render, setRender] = useState(false);
  const [date, setDate] = useState<Date | null>(new Date());
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const response = await me();

      const user = await response.json();

      if (user.is_admin) {
        setRender(true);
      }
    };

    checkAdmin().catch(console.error);
  }, []);

  if (!render) {
    return null;
  }

  const handleCreatingBooking = async () => {
    console.log(selectRef.current?.value);

    if (!date || !selectRef.current?.value) {
      handleSetAlertInfo(
        AlertState.failure,
        "Creating a booking failed, select a valid date."
      );
      return;
    }

    let lesson = MapToDbName(selectRef.current?.value);
    if (!lesson) {
      handleSetAlertInfo(
        AlertState.failure,
        "Creating a booking failed, invalid lesson type."
      );
      return;
    }

    let isoDate = dayjs(date)
      .subtract(1, "hour")
      .format("YYYY-MM-DDTHH:mm:ss[Z]");

    let response = await createClass({
      date: isoDate,
      class_name: lesson,
    });

    if (response.status !== 200) {
      let error = await response.json();
      handleSetAlertInfo(AlertState.failure, error.message);
      return;
    }

    let balletClass: BalletClass = await response.json();

    console.log("adding class: ", balletClass);

    handleSetAlertInfo(AlertState.success, "Created a booking successfuly");
    handleAddBooking(balletClass);
  };

  return (
    <>
      <Stack>
        <DatePicker
          label="Date"
          value={date}
          onChange={setDate}
          clearable={false}
        />
        <TimeInput
          label="Time"
          value={date}
          onChange={(value) => {
            console.log("d", value);
            const d = date;
            d?.setHours(value.getHours());
            d?.setMinutes(value.getMinutes());
            setDate(d);
          }}
        />
        <NativeSelect
          data={[
            "One On One",
            "Beginners (Online)",
            "Intermediate (Online)",
            "Course Beginners Level One (Online)",
            "Course Beginners Level One Seniors (Online)",
          ]}
          placeholder="Pick a lesson type"
          label="Lesson Type"
          ref={selectRef}
        />
        <Button onClick={() => handleCreatingBooking()}>Create</Button>
      </Stack>
    </>
  );
};

export default CreateClass;
