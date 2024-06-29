import { useState, useEffect } from "react";
import { client } from "../supabase/client";
import { useMessages } from "./useMessages";

export const useAppointments = () => {
  const [allAppointments, setAllAppointments] = useState<any>([]);
  const { showError } = useMessages();

  useEffect(() => {
    const getAllAppointments = async () => {
      try {
        const response = await client.from("citas").select(`
          id,
          created_at,
          fecha_servicio,
          hora_servicio,
          nombre_cliente,
          telefono_cliente,
          comentarios,
          servicio_solicitado (
            id,
            nombre_servicio
          )
        `);
        if (response.status === 200 || response.status === 201) {
          const data = response?.data?.map((appointment: any) => ({
            ...appointment,
            servicio_solicitado_id: appointment.servicio_solicitado.id,
            servicio_solicitado:
              appointment.servicio_solicitado.nombre_servicio,
          }));
          setAllAppointments(data);
        }
      } catch (err) {
        showError(
          "No se pudieron cargar los citas, contacte al proveedor del software"
        );
      }
    };

    getAllAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { allAppointments, setAllAppointments };
};
