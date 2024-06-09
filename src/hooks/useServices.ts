import { useState, useEffect } from "react";
import { client } from "../supabase/client";
import { useMessages } from "./useMessages";

export const useServices = () => {
  const [allServices, setAllServices] = useState<any>([]);
  const { showError } = useMessages();

  useEffect(() => {
    const getAllServices = async () => {
      try {
        const response = await client.from("servicios").select();
        if (response.status === 200 || response.status === 201) {
          setAllServices(response?.data);
        }
      } catch (err) {
        showError(
          "No se pudieron cargar los servicios, contacte al proveedor del software"
        );
      }
    };

    getAllServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { allServices, setAllServices };
};
