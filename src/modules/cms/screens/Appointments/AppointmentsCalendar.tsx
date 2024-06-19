import React from "react";
import type { BadgeProps, CalendarProps } from "antd";
import { Badge, Calendar } from "antd";
import type { Dayjs } from "dayjs";
import { useAppointments } from "../../../../hooks/useAppointments";

const AppointmentsCalendar: React.FC = () => {
  const { allAppointments } = useAppointments();

  const getListData = (value: Dayjs) => {
    // Filtrar las citas que corresponden a la fecha actual
    const listData = allAppointments
      .filter((appointment: any) =>
        value.isSame(appointment.fecha_servicio, "day")
      )
      .map((appointment: any) => ({
        type: "success",
        content: `${appointment.nombre_cliente} - ${appointment.servicio_solicitado}`,
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

  return <Calendar fullscreen cellRender={cellRender} />;
};

export default AppointmentsCalendar;

const getMonthData = (value: Dayjs) => {
  if (value.month() === 8) {
    return 1394;
  }
  return null;
};
