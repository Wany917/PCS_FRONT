'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

export default function Confirmation(): React.JSX.Element {
  const [reservationDetails, setReservationDetails] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const details = JSON.parse(localStorage.getItem('reservationDetails') || '{}');
    setReservationDetails(details);
  }, []);

  const handleBackHomeClick = () => {
    router.push('/');
  };

  if (!reservationDetails) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ pt: '40px' }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Stack spacing={4}>
            <Typography variant="h4" align="center">
              Confirmation de Réservation
            </Typography>
            <Typography variant="body1">
              Merci pour votre réservation ! Votre commande a été reçue avec succès.
            </Typography>
            <Typography variant="body1">
              <strong>Détails de la réservation :</strong>
            </Typography>
            <Typography variant="body1">
              Titre: {reservationDetails.title}
            </Typography>
            <Typography variant="body1">
              Dates : {reservationDetails.startDate} - {reservationDetails.endDate}
            </Typography>
            <Typography variant="body1">
              Voyageurs : {reservationDetails.travelers} voyageur{reservationDetails.travelers > 1 ? 's' : ''}
            </Typography>
            <Typography variant="body1">
              Total : {reservationDetails.totalAmount} €
            </Typography>
            <Typography variant="body1">
              Un email de confirmation vous a été envoyé avec les détails de votre réservation.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant="contained" color="primary" onClick={handleBackHomeClick}>
                Retour à l'accueil
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
