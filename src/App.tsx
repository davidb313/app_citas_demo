import React from "react";
import "./App.css";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import BarberCard from "./components/BarberCard";
import { DatePickerComponent } from "./components/DatePickerComponent";

export default function App() {
  return (
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
    </div>
  );
}
