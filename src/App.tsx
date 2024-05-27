import React from "react";
import "./App.css";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import Looks3Icon from "@mui/icons-material/Looks3";
import BarberCard from "./components/BarberCard";
import { DatePickerComponent } from "./components/DatePickerComponent";
import CustomerData from "./components/CustomerData";
import { Button, message } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

export default function App() {
  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Tu cita quedó agendada",
    });
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
        <DatePickerComponent />

        <div className='mt-10 flex gap-x-2'>
          <Looks3Icon />
          <h3 className='font-bold'>Ingresa tus datos</h3>
        </div>
        <CustomerData />

        <div className='p-10 flex justify-center'>
          <Button
            type='primary'
            onClick={success}
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
