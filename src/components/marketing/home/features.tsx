'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('your-publishable-key-here');

const prestations = [
  { id: 1, name: 'Taxis', price: 20 },
  { id: 2, name: 'Nettoyage', price: 15 },
  { id: 3, name: 'Valise', price: 10 },
];

function StripeForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
    if (!error) {
      console.log('PaymentMethod:', paymentMethod);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '16px' }}>
      <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', p: 2, mb: 2 }}>
        <CardElement />
      </Box>
      <Button type="submit" variant="contained" color="primary" disabled={!stripe || !elements}>
        Payer
      </Button>
    </form>
  );
}

export function Features(): React.JSX.Element {
  const [paymentMethod, setPaymentMethod] = useState<string>('creditCard');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvc, setCardCvc] = useState<string>('');
  const router = useRouter();

  const [reservationDetails, setReservationDetails] = useState<any>(null);

  useEffect(() => {
    const details = JSON.parse(localStorage.getItem('reservationDetails') || '{}');
    setReservationDetails(details);
  }, []);

  const handleReserveClick = () => {
    alert(`Votre réservation a été validée avec le moyen de paiement: ${paymentMethod}`);
    router.push('/confirmation');
  };

  if (!reservationDetails || Object.keys(reservationDetails).length === 0) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ pt: '40px' }}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Stack spacing={4}>
            <Typography variant="h4" align="center">
              Récapitulatif de la commande
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 3,
                    },
                  }}
                >
                  <Typography variant="h6">Votre voyage</Typography>
                  <Typography variant="body1">Titre: {reservationDetails.title}</Typography>
                  <Typography variant="body1">Dates: {reservationDetails.startDate} - {reservationDetails.endDate}</Typography>
                  <Typography variant="body1">Voyageurs: {reservationDetails.travelers} voyageur(s)</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 3,
                    },
                  }}
                >
                  <Typography variant="h6">Prestations choisies</Typography>
                  {prestations
                    .map((prest) => (
                      <Typography key={prest.id} variant="body1">
                        {prest.name} - {prest.price} €
                      </Typography>
                    ))}
                </Paper>
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 3,
                    },
                  }}
                >
                  <Typography variant="h6">Détails du prix</Typography>
                  <Typography variant="body1">Total: {reservationDetails.totalAmount} €</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 3,
                    },
                  }}
                >
                  <Typography variant="h6">Détails de paiement</Typography>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Choisissez votre moyen de paiement</FormLabel>
                    <RadioGroup
                      aria-label="payment-method"
                      name="payment-method"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <FormControlLabel value="creditCard" control={<Radio />} label="Carte de crédit" />
                      <FormControlLabel value="stripe" control={<Radio />} label="Stripe" />
                    </RadioGroup>
                  </FormControl>
                  {paymentMethod === 'creditCard' && (
                    <Box sx={{ mt: 2 }}>
                      <TextField
                        label="Numéro de carte"
                        fullWidth
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        label="Date d'expiration"
                        fullWidth
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        label="CVC"
                        fullWidth
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                      />
                    </Box>
                  )}
                  {paymentMethod === 'stripe' && (
                    <Elements stripe={stripePromise}>
                      <StripeForm />
                    </Elements>
                  )}
                </Paper>
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant="contained" color="primary" onClick={handleReserveClick}>
                Réserver
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
