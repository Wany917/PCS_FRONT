'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import differenceInDays from 'date-fns/differenceInDays';

const cleaningFee = 8;
const serviceFee = 13;
const taxes = 11;

const prestations = [
  { id: 1, name: 'Nettoyage quotidien', price: 25 },
  { id: 2, name: 'Service de blanchisserie', price: 15 },
  { id: 4, name: 'Service de petit déjeuner', price: 20 },
];

export function Productivity(): React.JSX.Element {
  const [selectedPrestations, setSelectedPrestations] = useState<number[]>([]);
  const [customPrestation, setCustomPrestation] = useState<string>('');
  const [customDate, setCustomDate] = useState<Date | null>(null);
  const [customTime, setCustomTime] = useState<Date | null>(null);
  const [customPrestationPrice, setCustomPrestationPrice] = useState<number>(0);
  const [reservationDetails, setReservationDetails] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const details = JSON.parse(localStorage.getItem('reservationDetails') || '{}');
    setReservationDetails(details);
  }, []);

  const handleCheckboxChange = (id: number) => {
    setSelectedPrestations((prev) =>
      prev.includes(id) ? prev.filter((prestId) => prestId !== id) : [...prev, id]
    );
  };

  const calculateTotalPrestationPrice = () => {
    const selectedPrestationPrices = prestations
      .filter((prest) => selectedPrestations.includes(prest.id))
      .map((prest) => prest.price);

    const totalPrestationPrice = selectedPrestationPrices.reduce((acc, curr) => acc + curr, 0);
    return totalPrestationPrice + (customPrestation ? customPrestationPrice : 0);
  };

  const calculateTotalPrice = () => {
    if (!reservationDetails) return 0;
    const totalPrestationPrice = calculateTotalPrestationPrice();
    const hotelTotalPrice = Number(reservationDetails.price) * reservationDetails.numberOfNights;
    const total = totalPrestationPrice + hotelTotalPrice + cleaningFee + serviceFee + taxes;
    return total;
  };

  const handleReserveClick = () => {
    const selectedPrestationNames = prestations
      .filter((prest) => selectedPrestations.includes(prest.id))
      .map((prest) => prest.name);

    if (customPrestation) {
      selectedPrestationNames.push(`Custom: ${customPrestation} at ${customDate?.toLocaleDateString()} ${customTime?.toLocaleTimeString()}`);
    }

    const updatedReservationDetails = {
      ...reservationDetails,
      prestations: selectedPrestationNames,
      totalAmount: calculateTotalPrice(),
    };

    localStorage.setItem('reservationDetails', JSON.stringify(updatedReservationDetails));

    alert(`Réservation pour les prestations : ${selectedPrestationNames.join(', ')}`);
    router.push('/validation');
  };

  const handleBackClick = () => {
    router.push('/');
  };

  const handleBackToHeroClick = () => {
    const heroId = reservationDetails?.id || '1';
    router.push(`/${heroId}`);
  };

  if (!reservationDetails) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4, position: 'relative' }}>
      <Stack direction="row" justifyContent="flex-start" sx={{ mb: 2 }}>
        <Button variant="contained" onClick={handleBackToHeroClick}>
          Page Précédente
        </Button>
      </Stack>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Sélectionnez vos prestations
      </Typography>
      <Stack spacing={2}>
        {prestations.map((prestation) => (
          <FormControlLabel
            key={prestation.id}
            control={
              <Checkbox
                checked={selectedPrestations.includes(prestation.id)}
                onChange={() => handleCheckboxChange(prestation.id)}
              />
            }
            label={`${prestation.name} - ${prestation.price} €`}
          />
        ))}
        <Box>
          <Typography variant="h6">Ajouter une prestation personnalisée</Typography>
          <TextField
            label="Prestation"
            value={customPrestation}
            onChange={(e) => setCustomPrestation(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Prix"
            type="number"
            value={customPrestationPrice}
            onChange={(e) => setCustomPrestationPrice(Number(e.target.value))}
            fullWidth
            sx={{ mb: 2 }}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Date et heure"
              value={customDate}
              onChange={setCustomDate}
              renderInput={(params) => <TextField {...params} sx={{ mb: 2 }} />}
            />
            <DateTimePicker
              label="Heure"
              value={customTime}
              onChange={setCustomTime}
              renderInput={(params) => <TextField {...params} sx={{ mb: 2 }} />}
            />
          </LocalizationProvider>
        </Box>
        <Typography variant="h6">
          Aucun montant ne vous sera débité pour le moment
        </Typography>
        <Typography variant="body1">
          {reservationDetails.price} € x {reservationDetails.numberOfNights} nuit{reservationDetails.numberOfNights > 1 ? 's' : ''}: {Number(reservationDetails.price) * reservationDetails.numberOfNights} €
        </Typography>
        <Typography variant="body1">
          Frais de ménage: {cleaningFee} €
        </Typography>
        <Typography variant="body1">
          Frais de service: {serviceFee} €
        </Typography>
        <Typography variant="body1">
          Taxes: {taxes} €
        </Typography>
        <Typography variant="h6">
          Total: {calculateTotalPrice()} €
        </Typography>
        <Button variant="contained" color="primary" onClick={handleReserveClick}>
          Réserver
        </Button>
      </Stack>
    </Container>
  );
}
