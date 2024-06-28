import { client } from "../../../../supabase/client";

const STATUS_CODE = 200;
const STATUS_CODE_201 = 201;
const STATUS_CODE_204 = 204;

interface IService {
  key: React.Key;
  id?: string;
  nombre_servicio: string;
  costo: number;
  estado: boolean;
}

const getServices = async () => {
  try {
    const response = await client.from("servicios").select();
    const { status, data } = response;
    return status === STATUS_CODE || status === STATUS_CODE_201 ? data : [];
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
};

const insertService = async (formattedValues: IService) => {
  try {
    const response = await client.from("servicios").insert([formattedValues]);
    const { status, data } = response;
    return status === STATUS_CODE || status === STATUS_CODE_201 ? data : [];
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
};

const updateService = async (
  updatedFields: Partial<IService>,
  currentServiceId: string
) => {
  try {
    const response = await client
      .from("servicios")
      .update(updatedFields)
      .eq("id", currentServiceId);
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

const deleteService = async (serviceId: string) => {
  try {
    const response = await client
      .from("servicios")
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

export { getServices, insertService, updateService, deleteService };
