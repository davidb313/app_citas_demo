import "./App.css";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import Looks3Icon from "@mui/icons-material/Looks3";
import BarberCard from "./components/BarberCard";
import { DatePickerComponent } from "./components/DatePickerComponent";
import { Button, DatePickerProps, message } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { CustomerData } from "./components/CustomerData";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { client } from "./supabase/client";

export default function App() {
  //Date Picker
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  //Customer Data
  const [customerName, setCustomerName] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");

  //Confirm Message
  const [messageApi, contextHolder] = message.useMessage();

  //Date Picker logic
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
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

  //Confirm Message
  const success = () => {
    messageApi.open({
      type: "success",
      content: "Tu cita quedó agendada, ya puedes cerrar la App",
      duration: 7,
    });
  };

  const error = () => {
    messageApi.open({
      type: "error",
      content:
        "La cita no pudo agendarse, comunícate con en el establecimiento",
    });
  };

  const handleSudmit = async () => {
    try {
      const response = await client.from("citas").insert({
        fecha_servicio: selectedDate,
        hora_servicio: selectedTime,
        nombre_cliente: customerName,
        telefono_cliente: customerNumber,
      });
      console.log(response);
      if (response?.status === 200 || response?.status === 201) {
        success();
        setSelectedDate(null);
        setSelectedTime(null);
        setSelectedButton(null);
        setCustomerName("");
        setCustomerNumber("");
      }
    } catch (err) {
      error();
    }
  };

  return (
    <>
      {contextHolder}
      <div className='p-5'>
        <h1 className='mt-5 flex text-3xl font-bold justify-center '>
          App de citas para Barbería
        </h1>

        <div className='mt-10 flex gap-x-2'>
          <LooksOneIcon />
          <h3 className='font-bold'>Selecciona a tu barbero</h3>
        </div>
        <BarberCard />

        <div className='mt-10 flex gap-x-2'>
          <LooksTwoIcon />
          <h3 className='font-bold'>Selecciona un día</h3>
        </div>
        <DatePickerComponent
          selectedDate={selectedDate}
          selectedButton={selectedButton}
          selectedTime={selectedTime}
          setToday={setToday}
          setTomorrow={setTomorrow}
          selectTime={selectTime}
          onChange={onChange}
        />

        <div className='mt-10 flex gap-x-2'>
          <Looks3Icon />
          <h3 className='font-bold'>Ingresa tus datos</h3>
        </div>
        <CustomerData
          customerName={customerName}
          setCustomerName={setCustomerName}
          customerNumber={customerNumber}
          setCustomerNumber={setCustomerNumber}
        />

        <div className='p-10 flex justify-center'>
          <Button
            type='primary'
            disabled={
              selectedDate === null ||
              selectedTime === null ||
              customerName === "" ||
              customerNumber === ""
            }
            onClick={handleSudmit}
            size='large'
            shape='round'
            icon={<CheckCircleOutlined />}
          >
            Agendar Cita
          </Button>
        </div>
      </div>
    </>
  );
}
