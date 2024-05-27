import React from "react";
import "./App.css";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import BarberCard from "./components/BarberCard";

export default function App() {
  return (
    <div className='p-5'>
      <h1 className='mt-5 flex text-3xl font-bold justify-center '>
        App de citas
      </h1>

      <div className='mt-10 flex gap-x-2'>
        <LooksOneIcon />
        <h3 className='font-bold'>Selecciona a tu barbero</h3>
      </div>
      <BarberCard />
      <BarberCard />
      <BarberCard />
    </div>
  );
}
