import { Dayjs } from "dayjs";
import { Card, Typography } from "antd";

interface CardProps {
  selectedServiceName: string | null;
  selectedServiceCost: string | null;
  selectedDate: Dayjs | null;
  selectedTime: Dayjs | null;
  customerName: string | null;
  customerNumber: string | null;
}

export const Checkout: React.FC<CardProps> = ({
  selectedServiceName,
  selectedServiceCost,
  selectedDate,
  selectedTime,
  customerName,
  customerNumber,
}) => {
  const formattedCosto =
    selectedServiceCost !== null
      ? new Intl.NumberFormat("es-CO", {
          style: "currency",
          currency: "COP",
          maximumSignificantDigits: 3,
        }).format(Number(selectedServiceCost))
      : "";
  return (
    <Card title='Resumen' size='small' style={{ width: "100%" }}>
      <Typography color='text.secondary'>
        Servicio: {selectedServiceName}
      </Typography>
      <Typography color='text.secondary'>
        Costo servicio: {formattedCosto}
      </Typography>
      <Typography color='text.secondary'>
        Fecha y Hora: {selectedDate ? selectedDate.format("DD-MM-YYYY") : ""}{" "}
        {selectedTime ? selectedTime.format("HH:mm") : ""}
      </Typography>
      <Typography color='text.secondary'>Cliente: {customerName}</Typography>
      <Typography color='text.secondary'>
        Número de teléfono: {customerNumber}
      </Typography>
    </Card>
  );
};
