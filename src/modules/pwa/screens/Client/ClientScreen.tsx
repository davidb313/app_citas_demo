import "./../../../../App.css";
import { client } from "../../../../supabase/client";
import { Button, DatePickerProps, TimePickerProps } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Checkout } from "../../components/Checkout";
import { CustomerData } from "../../components/CustomerData";
import { DatePickerComponent } from "../../components/DatePickerComponent";
import { Number1 } from "../../assets/icons/Number1";
import { Number2 } from "../../assets/icons/Number2";
import { Number3 } from "../../assets/icons/Number3";
import { RecipeReviewCard } from "../../components/RecipeReviewCard";
import { useState } from "react";
import { WhatsAppLogo } from "../../assets/icons/WhatsAppLogo";
import dayjs, { Dayjs } from "dayjs";
import logoBarberia from "../../assets/logoBarberia.avif";
import { useServices } from "../../../../hooks/useServices";
import { useMessages } from "../../../../hooks/useMessages";

export default function ClientScreen() {
  const { allServices } = useServices();
  const { showError, showSuccess, contextHolder } = useMessages();

  //useState de la informacion de los barberos
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null
  );
  const [selectedServiceName, setSelectedServiceName] = useState<string | null>(
    null
  );

  const [selectedServiceCost, setSelectedServiceCost] = useState<string | null>(
    null
  );

  //useState del Date y Time Picker
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);

  //useState de la info del cliente que toma el servicio
  const [customerName, setCustomerName] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");

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

  const handleSudmit = async () => {
    try {
      const insertInDataBase = await client.from("citas").insert({
        servicio_solicitado: selectedServiceId,
        fecha_servicio: selectedDate,
        hora_servicio: selectedTime?.format("HH:mm"),
        nombre_cliente: customerName,
        telefono_cliente: customerNumber,
      });

      if (
        insertInDataBase?.status === 200 ||
        insertInDataBase?.status === 201
      ) {
        showSuccess("¡Tu cita quedó agendada!");
        setSelectedDate(null);
        setSelectedTime(null);
        setSelectedButton(null);
        setCustomerName("");
        setCustomerNumber("");
        setSelectedServiceId("");
        setSelectedServiceName("");
        setSelectedServiceCost(null);
      }
    } catch (err) {
      showError(
        "Ocurrió un error en la App, comunícate con en el establecimiento"
      );
    }
  };

  return (
    <>
      {contextHolder}

      <div className='p-5'>
        <div className='flex flex-col items-center'>
          <img height='150' width='150' src={logoBarberia} alt='logo' />
          <h1 className='mt-2 text-2xl font-bold'>Citas [nombre de negocio]</h1>
          <p className='mt-2 text-sm'>
            Para cancelar o reprogramar una cita agendada, comunícate con
            nosotros
            <a
              href='https://api.whatsapp.com/send?phone=573045528606'
              style={{ marginLeft: 4 }}
            >
              <span
                style={{
                  display: "inline-block",
                  verticalAlign: "middle",
                }}
              >
                <WhatsAppLogo />
              </span>
            </a>
          </p>
        </div>

        <div className='mt-10 flex gap-x-2'>
          <Number1 />
          <h3 className='font-bold'>Selecciona el servicio que deseas</h3>
        </div>
        <div>
          {allServices?.map((service: any) => (
            <RecipeReviewCard
              key={service?.id}
              id={service?.id}
              name={service?.nombre_servicio}
              costo={service?.costo}
              setSelectedServiceCost={setSelectedServiceCost}
              selectedServiceId={selectedServiceId}
              setSelectedServiceId={setSelectedServiceId}
              setSelectedServiceName={setSelectedServiceName}
            />
          ))}
        </div>

        <div className='mt-10 flex gap-x-2'>
          <Number2 />
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
          <Number3 />
          <h3 className='font-bold'>Datos de contacto</h3>
        </div>
        <CustomerData
          customerName={customerName}
          setCustomerName={setCustomerName}
          customerNumber={customerNumber}
          setCustomerNumber={setCustomerNumber}
        />

        <div className='mt-10 flex gap-x-2'></div>
        <Checkout
          selectedServiceName={selectedServiceName}
          selectedServiceCost={selectedServiceCost}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          customerName={customerName}
          customerNumber={customerNumber}
        />

        <div className='p-7 flex justify-center'>
          <Button
            style={{ width: "100%" }}
            type='primary'
            disabled={
              selectedServiceId === null ||
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
