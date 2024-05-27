import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import BARBERO from "../assets/BARBERO.webp";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { CardActionArea } from "@mui/material";

export default function BarberCard() {
  return (
    <Card sx={{ display: "flex", marginTop: 3 }}>
      <CardActionArea>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <CardMedia
            component='img'
            sx={{ width: 90 }}
            image={BARBERO}
            alt='Live from space album cover'
          />
          <CardContent sx={{}}>
            <h2 className='font-semibold'>Nombre de Barbero 1</h2>

            <Typography
              variant='subtitle1'
              color='text.secondary'
              component='div'
            >
              Descripción barbero
            </Typography>
          </CardContent>
          <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
            <ArrowForwardIosIcon sx={{ height: 38, width: 38 }} />
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
}
