import React from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import AppointmentsCalendar from "./AppointmentsCalendar";
import AppointmentsTable from "./AppointmentsTable";

const onChange = (key: string) => {
  console.log(key);
};

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "Calendario",
    children: <AppointmentsCalendar />,
  },
  {
    key: "2",
    label: "Tabla",
    children: <AppointmentsTable />,
  },
];

const AppointmentsTab: React.FC = () => (
  <Tabs defaultActiveKey='1' items={items} onChange={onChange} />
);

export default AppointmentsTab;
