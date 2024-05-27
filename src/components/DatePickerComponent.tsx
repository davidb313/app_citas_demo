import React, { useState } from "react";
import type { DatePickerProps } from "antd";
import { Button, DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";

export const DatePickerComponent: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
    setSelectedDate(date);
    setSelectedButton(null);
  };

  const setToday = () => {
    const today = dayjs();
    setSelectedDate(today);
    setSelectedButton("today");
    setSelectedTime(null); // Reset selected time
  };

  const setTomorrow = () => {
    const tomorrow = dayjs().add(1, "day");
    setSelectedDate(tomorrow);
    setSelectedButton("tomorrow");
    setSelectedTime(null); // Reset selected time
  };

  const selectTime = (time: string) => {
    setSelectedTime(time);
  };

  return (
    <>
      <div className='flex mt-6 space-x-4'>
        <Button
          type={selectedButton === "today" ? "primary" : "default"}
          onClick={setToday}
        >
          Hoy
        </Button>
        <Button
          type={selectedButton === "tomorrow" ? "primary" : "default"}
          onClick={setTomorrow}
        >
          Mañana
        </Button>
        <DatePicker
          className='w-screen'
          placeholder='Selecciona otro día'
          value={selectedDate}
          onChange={onChange}
        />
      </div>

      {selectedDate && (
        <>
          <p className='mt-4 font-medium'>Selecciona un horario</p>
          <div className='flex flex-wrap mt-4 gap-x-2 gap-y-3'>
            {["9:00 am", "10:00 am", "11:00 am", "2:00 pm", "4:00 pm"].map(
              (time) => (
                <Button
                  key={time}
                  type={selectedTime === time ? "primary" : "dashed"}
                  onClick={() => selectTime(time)}
                >
                  {time}
                </Button>
              )
            )}
          </div>
        </>
      )}
    </>
  );
};
