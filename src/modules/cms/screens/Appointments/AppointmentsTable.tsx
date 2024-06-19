import React from "react";
import { Table } from "antd";
import type { TableColumnsType } from "antd";
import { useAppointments } from "../../../../hooks/useAppointments";

interface DataType {
  key: React.Key;
  servicio_solicitado: string;
  fecha_servicio: string;
  hora_servicio: string;
  nombre_cliente: string;
  telefono_cliente: string;
  comentarios: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: "Servicio solicitado",
    dataIndex: "servicio_solicitado",
  },
  {
    title: "Fecha del servicio",
    dataIndex: "fecha_servicio",
  },
  {
    title: "Hora del servicio",
    dataIndex: "hora_servicio",
  },
  {
    title: "Nombre del cliente",
    dataIndex: "nombre_cliente",
  },
  {
    title: "Teléfono del cliente",
    dataIndex: "telefono_cliente",
  },
  {
    title: "Comentarios del cliente",
    dataIndex: "comentarios",
    width: 100,
    render: (text) => (
      <div style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
        {text}
      </div>
    ),
  },
];

const AppointmentsTable: React.FC = () => {
  const { allAppointments } = useAppointments();

  return (
    <>
      <Table
        columns={columns}
        dataSource={allAppointments.map((appointment: any) => ({
          ...appointment,
          key: appointment.id,
        }))}
        size='small'
      />
    </>
  );
};

export default AppointmentsTable;
