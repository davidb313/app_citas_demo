import "./App.css";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import Looks3Icon from "@mui/icons-material/Looks3";
import logoBarberia from "../src/assets/logoBarberia.png";
import { DatePickerComponent } from "./components/DatePickerComponent";
import { Button, DatePickerProps, TimePickerProps, message } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { CustomerData } from "./components/CustomerData";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { client } from "./supabase/client";
import { RecipeReviewCard } from "./components/RecipeReviewCard";

export default function App() {
  //Lista donde se guarda la info de todos los barberos
  const [allBarbersFromSupabase, setAllBarbersFromSupabase] = useState<any>([]);

  //useState de la informacion de los barberos
  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedBarberName, setSelectedBarberName] = useState<string | null>(
    null
  );
  console.log(selectedBarberName);

  //useState del Date y Time Picker
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);

  //useState de la info del cliente que toma el servicio
  const [customerName, setCustomerName] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");

  //useState del mensaje de confirmacion
  const [messageApi, contextHolder] = message.useMessage();

  //Traer a todos los barberos que se crean en Supabase
  const getAllBarbers = async () => {
    try {
      const response = await client.from("barberos").select();
      if (response.status === 200) {
        setAllBarbersFromSupabase(response.data);
      }
    } catch (err) {
      error();
    }
  };

  //Este useEffect trae a todos los barberos apenas se carga la App
  useEffect(() => {
    getAllBarbers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Logica del Date y Time Picker
  const onChange: DatePickerProps["onChange"] = (date) => {
    setSelectedDate(date);
    setSelectedButton(null);
  };

  const onChangeTime: TimePickerProps["onChange"] = (time) => {
    setSelectedTime(time);
  };

  const setToday = () => {
    const today = dayjs();
    setSelectedDate(today);
    setSelectedButton("today");
    setSelectedTime(null);
  };

  const setTomorrow = () => {
    const tomorrow = dayjs().add(1, "day");
    setSelectedDate(tomorrow);
    setSelectedButton("tomorrow");
    setSelectedTime(null);
  };

  //Mensajes de confirmacion o error de la App
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
        "Ocurrió un error en la App, comunícate con en el establecimiento",
    });
  };

  const handleSudmit = async () => {
    try {
      const insertInDataBase = await client.from("citas").insert({
        barbero: selectedBarberId,
        servicio: selectedService,
        fecha_servicio: selectedDate,
        hora_servicio: selectedTime?.format("HH:mm"),
        nombre_cliente: customerName,
        telefono_cliente: customerNumber,
      });

      if (
        insertInDataBase?.status === 200 ||
        insertInDataBase?.status === 201
      ) {
        success();
        setSelectedDate(null);
        setSelectedTime(null);
        setSelectedButton(null);
        setCustomerName("");
        setCustomerNumber("");
        setSelectedBarberId("");
        setSelectedService("");
        setSelectedBarberName(null);
      }
    } catch (err) {
      error();
    }
  };

  return (
    <>
      {contextHolder}
      <div className='p-5'>
        <div className='flex flex-col items-center'>
          <img height='200' width='200' src={logoBarberia} alt='logo' />
          <h1 className='text-3xl font-bold'>Citas para Barbería</h1>
        </div>

        <div className='mt-10 flex gap-x-2'>
          <LooksOneIcon />
          <h3 className='font-bold'>
            Selecciona el servicio de tu barbero favorito
          </h3>
        </div>
        <div>
          {allBarbersFromSupabase?.map((barber: any) => (
            <RecipeReviewCard
              key={barber?.id}
              id={barber?.id}
              name={barber?.nombre_barbero}
              selectedBarber={selectedBarberId}
              setSelectedBarber={setSelectedBarberId}
              setSelectedBarberName={setSelectedBarberName}
              selectedService={selectedService}
              setSelectedService={setSelectedService}
            />
          ))}
        </div>

        <div className='mt-10 flex gap-x-2'>
          <LooksTwoIcon />
          <h3 className='font-bold'>Selecciona el día y la hora</h3>
        </div>
        <DatePickerComponent
          selectedDate={selectedDate}
          selectedButton={selectedButton}
          selectedTime={selectedTime}
          setToday={setToday}
          setTomorrow={setTomorrow}
          onChange={onChange}
          onChangeTime={onChangeTime}
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
              customerNumber === "" ||
              selectedBarberId === null ||
              selectedService === null
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
