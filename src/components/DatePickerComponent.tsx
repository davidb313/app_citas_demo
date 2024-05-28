import { Button, DatePicker, DatePickerProps } from "antd";
import { Dayjs } from "dayjs";

interface DatePickerComponentProps {
  selectedDate: Dayjs | null;
  selectedButton: string | null;
  selectedTime: string | null;
  setToday: () => void;
  setTomorrow: () => void;
  selectTime: (time: string) => void;
  onChange: DatePickerProps["onChange"];
}

export const DatePickerComponent: React.FC<DatePickerComponentProps> = ({
  selectedDate,
  selectedButton,
  selectedTime,
  setToday,
  setTomorrow,
  selectTime,
  onChange,
}) => {
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
