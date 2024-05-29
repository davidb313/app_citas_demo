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

type DisabledTime = (now: Dayjs) => {
  disabledHours?: () => number[];
  disabledMinutes?: (selectedHour: number) => number[];
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

  const disabledTime: DisabledTime = (now) => {
    const currentHour = now.hour();
    const currentMinute = now.minute();

    const disablePastHours = () => {
      return Array.from({ length: currentHour }, (_, i) => i);
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
          disabledDate={disabledDate}
          placeholder='Selecciona otro día'
          value={selectedDate}
          onChange={onChange}
        />
      </div>

      {selectedDate && (
        <>
          <TimePicker
            disabledTime={() => disabledTime(currentTime)}
            className='mt-4 w-full'
            use12Hours
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
