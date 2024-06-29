import { Dayjs } from "dayjs";
import { client } from "../../../../supabase/client";

const STATUS_CODE = 200;
const STATUS_CODE_201 = 201;
const STATUS_CODE_204 = 204;

export interface IAppointment {
  key: React.Key;
  id?: string;
  servicio_solicitado: string;
  fecha_servicio: Dayjs | null;
  hora_servicio: Dayjs | null;
  nombre_cliente: string;
  telefono_cliente: string;
  comentarios: string;
}

const getAppointments = async () => {
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
    const { status, data } = response;
    return status === STATUS_CODE || status === STATUS_CODE_201 ? data : [];
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
};

const insertAppointment = async (formattedValues: IAppointment) => {
  try {
    const response = await client.from("citas").insert([formattedValues]);
    const { status, data } = response;
    return status === STATUS_CODE ||
      status === STATUS_CODE_201 ||
      status === STATUS_CODE_204
      ? data
      : [];
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
};

const updateAppointment = async (
  updatedFields: Partial<IAppointment>,
  currentAppointmentId: string
) => {
  try {
    const response = await client
      .from("citas")
      .update(updatedFields)
      .eq("id", currentAppointmentId);
    const { status, data } = response;
    return status === STATUS_CODE ||
      status === STATUS_CODE_201 ||
      STATUS_CODE_204
      ? data
      : [];
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
};

const deleteAppointment = async (serviceId: string) => {
  try {
    const response = await client
      .from("citas")
      .delete()
      .eq("id", serviceId)
      .single();
    const { status } = response;
    return status === STATUS_CODE || status === STATUS_CODE_204;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
};

export {
  getAppointments,
  insertAppointment,
  updateAppointment,
  deleteAppointment,
};
