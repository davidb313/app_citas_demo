import { Card, CardMedia, Typography } from "@mui/material";
import { Button } from "antd";
import BARBERO from "../assets/BARBERO.webp";

interface CardProps {
  id: string;
  name: string;
  selectedBarber: string | null;
  setSelectedBarber: React.Dispatch<React.SetStateAction<string | null>>;
  selectedService: string | null;
  setSelectedService: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedBarberName: React.Dispatch<React.SetStateAction<string | null>>;
}

export const RecipeReviewCard: React.FC<CardProps> = ({
  id,
  name,
  selectedBarber,
  setSelectedBarber,
  selectedService,
  setSelectedService,
  setSelectedBarberName,
}) => {
  const handleServiceClick = (service: string) => {
    if (selectedBarber === null || selectedBarber === id) {
      if (selectedService === service && selectedBarber === id) {
        setSelectedService(null);
        setSelectedBarber(null);
        setSelectedBarberName(null);
      } else {
        setSelectedService(service);
        setSelectedBarber(id);
        setSelectedBarberName(name);
      }
    }
  };

  return (
    <Card sx={{ maxWidth: "auto", marginTop: 3 }}>
      <div className='flex'>
        <CardMedia
          component='img'
          sx={{ height: "auto", width: 100, objectFit: "cover" }}
          image={BARBERO}
          alt='foto barbero'
        />
        <div className='ml-4'>
          <Typography variant='h6' color='text.primary'>
            {name}
          </Typography>

          <div className='mt-2 mb-2'>
            <Typography variant='body2' color='text.secondary'>
              Escoge un servicio:
            </Typography>

            <div className='flex flex-wrap mt-2 gap-2'>
              <Button
                type={
                  selectedService === "corte" && selectedBarber === id
                    ? "primary"
                    : "default"
                }
                onClick={() => handleServiceClick("corte")}
                disabled={selectedBarber !== null && selectedBarber !== id}
                size='small' // Agrega esta línea para hacer el botón más pequeño
              >
                Corte de Cabello $20.000
              </Button>
              <Button
                type={
                  selectedService === "corte_barba" && selectedBarber === id
                    ? "primary"
                    : "default"
                }
                onClick={() => handleServiceClick("corte_barba")}
                disabled={selectedBarber !== null && selectedBarber !== id}
                size='small' // Agrega esta línea para hacer el botón más pequeño
              >
                Corte + Barba $23.000
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
