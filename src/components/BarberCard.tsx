import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BARBERO from "../assets/BARBERO.webp";
import { Button } from "antd";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface CardProps {
  id: string;
  selectedCard: string | null;
  setSelectedCard: React.Dispatch<React.SetStateAction<string | null>>;
  selectedService: string | null;
  setSelectedService: React.Dispatch<React.SetStateAction<string | null>>;
}

const RecipeReviewCard: React.FC<CardProps> = ({
  id,
  selectedCard,
  setSelectedCard,
  selectedService,
  setSelectedService,
}) => {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleServiceClick = (service: string) => {
    if (selectedCard === null || selectedCard === id) {
      if (selectedService === service && selectedCard === id) {
        setSelectedService(null);
        setSelectedCard(null);
      } else {
        setSelectedService(service);
        setSelectedCard(id);
      }
    }
  };

  return (
    <Card sx={{ maxWidth: "auto", marginTop: 3 }}>
      <div className='flex justify-between'>
        <CardMedia
          component='img'
          sx={{ width: 100 }}
          image={BARBERO}
          alt='Paella dish'
        />
        <CardContent>
          <Typography variant='body1' color='text.primary'>
            Nombre barbero
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Descripción barbero
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label='show more'
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
      </div>
      <Collapse in={expanded} timeout='auto' unmountOnExit>
        <CardContent>
          <h2 className='font-semibold mb-3'>Servicios:</h2>
          <div className='space-y-4'>
            <Button
              type={
                selectedService === "corte" && selectedCard === id
                  ? "primary"
                  : "default"
              }
              onClick={() => handleServiceClick("corte")}
              disabled={selectedCard !== null && selectedCard !== id}
            >
              Corte de Cabello $20.000
            </Button>
            <Button
              type={
                selectedService === "corte_barba" && selectedCard === id
                  ? "primary"
                  : "default"
              }
              onClick={() => handleServiceClick("corte_barba")}
              disabled={selectedCard !== null && selectedCard !== id}
            >
              Corte de Cabello + Barba $23.000
            </Button>
          </div>
        </CardContent>
      </Collapse>
    </Card>
  );
};

const CardContainer: React.FC = () => {
  const [selectedCard, setSelectedCard] = React.useState<string | null>(null);
  const [selectedService, setSelectedService] = React.useState<string | null>(
    null
  );

  return (
    <div>
      {["card1", "card2", "card3"].map((id) => (
        <RecipeReviewCard
          key={id}
          id={id}
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
          selectedService={selectedService}
          setSelectedService={setSelectedService}
        />
      ))}
    </div>
  );
};

export default CardContainer;
