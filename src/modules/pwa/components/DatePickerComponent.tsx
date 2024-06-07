import { Button, DatePicker, DatePickerProps, TimePickerProps } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { TimePicker } from "antd";

interface DatePickerComponentProps {
  selectedDate: Dayjs | null;
  selectedButton: string | null;
  selectedTime: Dayjs | null;
  setToday: () => void;
  setTomorrow: () => void;
  onChange: DatePickerProps["onChange"];
  onChangeTime: TimePickerProps["onChange"];
}

type DisabledTime = {
  disabledHours: () => number[];
  disabledMinutes: (selectedHour: number) => number[];
};

const format = "HH:mm";

export const DatePickerComponent: React.FC<DatePickerComponentProps> = ({
  selectedDate,
  selectedButton,
  selectedTime,
  setToday,
  setTomorrow,
  onChange,
  onChangeTime,
}) => {
  const disabledDate = (current: any) => {
    return current && current < dayjs().startOf("day");
  };

  const currentTime = dayjs();

  const disabledTime = (selectedDate: Dayjs): DisabledTime => {
    if (!selectedDate.isSame(currentTime, "day")) {
      return {
        disabledHours: () =>
          Array.from({ length: 8 }, (_, i) => i).concat(
            Array.from({ length: 4 }, (_, i) => i + 20)
          ),
        disabledMinutes: () => [],
      };
    }

    const currentHour = currentTime.hour();
    const currentMinute = currentTime.minute();

    const disableBefore8am = () => Array.from({ length: 8 }, (_, i) => i); // Horas 0-7
    const disableAfter8pm = () => Array.from({ length: 4 }, (_, i) => i + 20); // Horas 20-23

    const disablePastHours = () => {
      const hours = [...disableBefore8am(), ...disableAfter8pm()];
      for (let i = 8; i < 20; i++) {
        if (i < currentHour) {
          hours.push(i);
        }
      }
      return hours;
    };

    const disablePastMinutes = (selectedHour: number) => {
      if (selectedHour === currentHour) {
        return Array.from({ length: currentMinute }, (_, i) => i);
      }
      return [];
    };

    return {
      disabledHours: disablePastHours,
      disabledMinutes: disablePastMinutes,
    };
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
          allowClear={true}
          format='DD-MM-YYYY'
          disabledDate={disabledDate}
          placeholder='Selecciona otro día'
          value={selectedDate}
          onChange={onChange}
        />
      </div>

      {selectedDate && (
        <>
          <TimePicker
            disabledTime={() => disabledTime(selectedDate)}
            use12Hours={false}
            className='mt-4 w-full'
            allowClear={true}
            minuteStep={15}
            placeholder='Selecciona la hora'
            format={format}
            value={selectedTime}
            onChange={onChangeTime}
            showNow={false}
          />
        </>
      )}
    </>
  );
};
