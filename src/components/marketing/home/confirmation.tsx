'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function Confirmation(): React.JSX.Element {
  const router = useRouter();

  const handleBackHomeClick = () => {
    router.push('/');
  };

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
              Dates : 30 sept. - 5 oct.
            </Typography>
            <Typography variant="body1">
              Voyageurs : 1 voyageur
            </Typography>
            <Typography variant="body1">
              Prestations : Taxis, Nettoyage, Service personnalisé
            </Typography>
            <Typography variant="body1">
              Total : 350 €
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
