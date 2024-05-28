import "./App.css";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import Looks3Icon from "@mui/icons-material/Looks3";
import BARBERO from "../src/assets/BARBERO.webp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { DatePickerComponent } from "./components/DatePickerComponent";
import { Button, DatePickerProps, message } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { CustomerData } from "./components/CustomerData";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { client } from "./supabase/client";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Collapse,
  IconButton,
  IconButtonProps,
  Typography,
  styled,
} from "@mui/material";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface CardProps {
  id: string;
  selectedBarber: string | null;
  setSelectedBarber: React.Dispatch<React.SetStateAction<string | null>>;
  selectedService: string | null;
  setSelectedService: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function App() {
  //Babrbers List
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  //Date Picker
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  //Customer Data
  const [customerName, setCustomerName] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");

  //Confirm Message
  const [messageApi, contextHolder] = message.useMessage();

  const RecipeReviewCard: React.FC<CardProps> = ({
    id,
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
        <div className='flex items-center'>
          <CardMedia
            component='img'
            sx={{ height: 70, width: 70, objectFit: "cover" }} // Ajustar el tamaño de la imagen
            image={BARBERO}
            alt='foto barbero'
          />
          <div className='ml-4'>
            <Typography variant='h6' color='text.primary'>
              Nombre barbero
            </Typography>
          </div>
        </div>

        <div className='p-2'>
          <Typography variant='body2' color='text.secondary'>
            Escoge un servicio
          </Typography>

          <div className='flex flex-wrap mt-1 space-y-2'>
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
              Corte de Cabello + Barba $23.000
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  //Barbers Logic
  const getAllBarbers = async () => {
    const response = await client.from("barberos").select();
    console.log(response);
  };

  useEffect(() => {
    getAllBarbers();
  }, []);

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
        <div>
          {["idBarbero"].map((id) => (
            <RecipeReviewCard
              key={id}
              id={id}
              selectedBarber={selectedBarber}
              setSelectedBarber={setSelectedBarber}
              selectedService={selectedService}
              setSelectedService={setSelectedService}
            />
          ))}
        </div>

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
