import React, { useState } from "react";
import type { BadgeProps, CalendarProps } from "antd";
import { Badge, Calendar, Modal, List } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs"; // Importa dayjs
import { useAppointments } from "../../../../hooks/useAppointments";
import { WhatsAppOutlined } from "@ant-design/icons";

const AppointmentsCalendar: React.FC = () => {
  const { allAppointments } = useAppointments();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAppointments, setSelectedAppointments] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const getListData = (value: Dayjs) => {
    // Filtrar las citas que corresponden a la fecha actual y ordenarlas por hora_servicio
    const listData = allAppointments
      .filter((appointment: any) =>
        value.isSame(appointment.fecha_servicio, "day")
      )
      .sort((a: any, b: any) => {
        if (a.hora_servicio < b.hora_servicio) return -1;
        if (a.hora_servicio > b.hora_servicio) return 1;
        return 0;
      })
      .map((appointment: any) => ({
        type: "success",
        content: `${appointment.nombre_cliente} - ${dayjs(
          appointment.hora_servicio,
          "HH:mm:ss"
        ).format("HH:mm")} - ${appointment.servicio_solicitado}`,
        ...appointment,
      }));
    return listData;
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul className='events'>
        {listData.map((item: any, index: number) => (
          <li key={index}>
            <Badge
              status={item.type as BadgeProps["status"]}
              text={item.content}
            />
          </li>
        ))}
      </ul>
    );
  };

  const handleDateSelect = (value: Dayjs) => {
    const listData = getListData(value);
    setSelectedAppointments(listData);
    setSelectedDate(value);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedAppointments([]);
    setSelectedDate(null);
  };

  const monthCellRender = (value: Dayjs) => {
    const num = getMonthData(value);
    return num ? (
      <div className='notes-month'>
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };

  return (
    <>
      <Calendar
        fullscreen
        cellRender={cellRender}
        onSelect={handleDateSelect}
      />
      <Modal
        title={`Citas del ${selectedDate?.format("DD-MM-YYYY")}`}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <List
          itemLayout='horizontal'
          dataSource={selectedAppointments}
          renderItem={(appointment: any) => (
            <List.Item>
              <List.Item.Meta
                className='font-bold'
                title={`${appointment.nombre_cliente} - ${dayjs(
                  appointment.hora_servicio,
                  "HH:mm:ss"
                ).format("HH:mm")}`}
                description={
                  <>
                    <div>Servicio: {appointment.servicio_solicitado}</div>
                    <div>
                      Teléfono:
                      <a
                        href={`https://api.whatsapp.com/send?phone=${appointment.telefono_cliente}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        style={{ marginLeft: 4 }}
                      >
                        <WhatsAppOutlined style={{ marginRight: 4 }} />
                        {appointment.telefono_cliente}
                      </a>
                    </div>
                    <div>Comentarios: {appointment.comentarios}</div>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
};

export default AppointmentsCalendar;

const getMonthData = (value: Dayjs) => {
  if (value.month() === 8) {
    return 1394;
  }
  return null;
};
