'use client';
import * as React from 'react';
import { useState } from 'react';
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

const hotelPricePerNight = 100;
const numberOfNights = 3;

const prestations = [
  { id: 1, name: 'Taxis', price: 20 },
  { id: 2, name: 'Nettoyage', price: 15 },
  { id: 3, name: 'Valise', price: 10 },
];

const selectedPrestations = [1, 2]; // Example of selected prestations
const customPrestation = "Service personnalisé";
const customPrestationPrice = 50;

const calculateTotalPrestationPrice = () => {
  const selectedPrestationPrices = prestations
    .filter((prest) => selectedPrestations.includes(prest.id))
    .map((prest) => prest.price);

  const totalPrestationPrice = selectedPrestationPrices.reduce((acc, curr) => acc + curr, 0);
  return totalPrestationPrice + (customPrestation ? customPrestationPrice : 0);
};

const calculateTotalPrice = () => {
  const totalPrestationPrice = calculateTotalPrestationPrice();
  const hotelTotalPrice = hotelPricePerNight * numberOfNights;
  return totalPrestationPrice + hotelTotalPrice;
};

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

  const handleReserveClick = () => {
    alert(`Votre réservation a été validée avec le moyen de paiement: ${paymentMethod}`);
    router.push('/confirmation');
  };

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
                  <Typography variant="body1">Dates: 30 sept. - 5 oct.</Typography>
                  <Typography variant="body1">Voyageurs: 1 voyageur</Typography>
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
                    .filter((prest) => selectedPrestations.includes(prest.id))
                    .map((prest) => (
                      <Typography key={prest.id} variant="body1">
                        {prest.name} - {prest.price} €
                      </Typography>
                    ))}
                  {customPrestation && (
                    <Typography variant="body1">
                      {customPrestation} - {customPrestationPrice} €
                    </Typography>
                  )}
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
                  <Typography variant="body1">Prix par nuit: {hotelPricePerNight} €</Typography>
                  <Typography variant="body1">Nombre de nuits: {numberOfNights}</Typography>
                  <Typography variant="body1">
                    Total des prestations: {calculateTotalPrestationPrice()} €
                  </Typography>
                  <Typography variant="body1">
                    Total: {calculateTotalPrice()} €
                  </Typography>
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
