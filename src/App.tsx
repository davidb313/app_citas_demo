import "./App.css";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import Looks3Icon from "@mui/icons-material/Looks3";
import BARBERO from "../src/assets/BARBERO.webp";
import logoBarberia from "../src/assets/logoBarberia.png";
import { DatePickerComponent } from "./components/DatePickerComponent";
import { Button, DatePickerProps, TimePickerProps, message } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { CustomerData } from "./components/CustomerData";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { client } from "./supabase/client";
import { Card, CardMedia, Typography } from "@mui/material";

interface CardProps {
  id: string;
  name: string;
  selectedBarber: string | null;
  setSelectedBarber: React.Dispatch<React.SetStateAction<string | null>>;
  selectedService: string | null;
  setSelectedService: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function App() {
  //Barbers List
  const [allBarbers, setAllBarbers] = useState<any>([]);

  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  //Date Picker
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);

  //Customer Data
  const [customerName, setCustomerName] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");

  //Confirm Message
  const [messageApi, contextHolder] = message.useMessage();

  //Barbers Logic
  const getAllBarbers = async () => {
    try {
      const response = await client.from("barberos").select();
      if (response.status === 200) {
        setAllBarbers(response.data);
      }
    } catch (err) {
      error();
    }
  };

  console.log(selectedTime);

  useEffect(() => {
    getAllBarbers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const RecipeReviewCard: React.FC<CardProps> = ({
    id,
    name,
    selectedBarber,
    setSelectedBarber,
    selectedService,
    setSelectedService,
  }) => {
    const handleServiceClick = (service: string) => {
      if (selectedBarber === null || selectedBarber === id) {
        if (selectedService === service && selectedBarber === id) {
          setSelectedService(null);
          setSelectedBarber(null);
        } else {
          setSelectedService(service);
          setSelectedBarber(id);
        }
      }
    };

    return (
      <Card sx={{ maxWidth: "auto", marginTop: 3 }}>
        <div className='flex'>
          <CardMedia
            component='img'
            sx={{ height: "auto", width: 100, objectFit: "cover" }}
            image={BARBERO}
            alt='foto barbero'
          />
          <div className='ml-4'>
            <Typography variant='h6' color='text.primary'>
              {name}
            </Typography>

            <div className='mt-2 mb-2'>
              <Typography variant='body2' color='text.secondary'>
                Escoge un servicio:
              </Typography>

              <div className='flex flex-wrap mt-2 gap-2'>
                <Button
                  type={
                    selectedService === "corte" && selectedBarber === id
                      ? "primary"
                      : "default"
                  }
                  onClick={() => handleServiceClick("corte")}
                  disabled={selectedBarber !== null && selectedBarber !== id}
                  size='small' // Agrega esta línea para hacer el botón más pequeño
                >
                  Corte de Cabello $20.000
                </Button>
                <Button
                  type={
                    selectedService === "corte_barba" && selectedBarber === id
                      ? "primary"
                      : "default"
                  }
                  onClick={() => handleServiceClick("corte_barba")}
                  disabled={selectedBarber !== null && selectedBarber !== id}
                  size='small' // Agrega esta línea para hacer el botón más pequeño
                >
                  Corte + Barba $23.000
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  //Date Picker logic
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
    setSelectedTime(null); // Reset selected time
  };

  const setTomorrow = () => {
    const tomorrow = dayjs().add(1, "day");
    setSelectedDate(tomorrow);
    setSelectedButton("tomorrow");
    setSelectedTime(null); // Reset selected time
  };

  /* const selectTime = (time: string) => {
    setSelectedTime(time);
  }; */

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
        "Sucedío un error en la App, comunícate con en el establecimiento",
    });
  };

  const handleSudmit = async () => {
    try {
      const response = await client.from("citas").insert({
        barbero: selectedBarber,
        servicio: selectedService,
        fecha_servicio: selectedDate,
        hora_servicio: selectedTime?.format("HH:mm"),
        nombre_cliente: customerName,
        telefono_cliente: customerNumber,
      });
      if (response?.status === 200 || response?.status === 201) {
        success();
        setSelectedDate(null);
        setSelectedTime(null);
        setSelectedButton(null);
        setCustomerName("");
        setCustomerNumber("");
        setSelectedBarber("");
        setSelectedService("");
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
          <h1 className='text-3xl font-bold'>App de citas para Barbería</h1>
        </div>

        <div className='mt-10 flex gap-x-2'>
          <LooksOneIcon />
          <h3 className='font-bold'>
            Selecciona el servicio de tu barbero favorito
          </h3>
        </div>
        <div>
          {allBarbers?.map((barber: any) => (
            <RecipeReviewCard
              key={barber?.id}
              id={barber?.id}
              name={barber?.nombre_barbero}
              selectedBarber={selectedBarber}
              setSelectedBarber={setSelectedBarber}
              selectedService={selectedService}
              setSelectedService={setSelectedService}
            />
          ))}
        </div>

        <div className='mt-10 flex gap-x-2'>
          <LooksTwoIcon />
          <h3 className='font-bold'>Selecciona el día</h3>
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
              selectedBarber === null ||
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
