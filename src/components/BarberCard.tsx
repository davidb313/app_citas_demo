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
import { Button } from "@mui/material";

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

export default function RecipeReviewCard() {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
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
          <Typography variant='h6' color='text.primary'>
            Descripción barbero
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
            <Button variant='outlined'>Corte de Cabello $20.000</Button>
            <Button variant='outlined'>Corte de Cabello + Barba $23.000</Button>
          </div>
        </CardContent>
      </Collapse>
    </Card>
  );
}
