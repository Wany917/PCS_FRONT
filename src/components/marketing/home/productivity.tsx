'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
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
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const cleaningFee = 8;
const serviceFee = 13;
const taxes = 11;

const prestations = [
  { id: 1, name: 'Nettoyage quotidien', price: 25 },
  { id: 2, name: 'Service de blanchisserie', price: 15 },
  { id: 4, name: 'Service de petit déjeuner', price: 20 },
];

interface ServiceRequest {
  id: number;
  name: string;
  description: string;
  amount: number;
  user_id: number;
  booking_id: number;
}

export function Productivity(): React.JSX.Element {
  const router = useRouter();
  const [reservationDetails, setReservationDetails] = useState<any>(null);
  const [selectedPrestations, setSelectedPrestations] = useState<number[]>([]);
  const [customPrestation, setCustomPrestation] = useState<string>('');
  const [customPrestationPrice, setCustomPrestationPrice] = useState<number>(0);
  const [customDate, setCustomDate] = useState<Date | null>(null);
  const [customTime, setCustomTime] = useState<Date | null>(null);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [newRequest, setNewRequest] = useState({ name: '', description: '', amount: 0 });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    const details = JSON.parse(localStorage.getItem('reservationDetails') || '{}');
    setReservationDetails(details);
    fetchServiceRequests();
  }, []);

  const fetchServiceRequests = async () => {
    try {
      const response = await axios.get('/service_requests');
      setServiceRequests(response.data);
    } catch (error) {
      console.error('Error fetching service requests:', error);
    }
  };

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
    const serviceRequestsTotal = serviceRequests.reduce((total, request) => total + (request.amount || 0), 0);
    const total = totalPrestationPrice + hotelTotalPrice + cleaningFee + serviceFee + taxes + serviceRequestsTotal;
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
      serviceRequests,
    };

    localStorage.setItem('reservationDetails', JSON.stringify(updatedReservationDetails));

    alert(`Réservation pour les prestations : ${selectedPrestationNames.join(', ')}`);
    router.push('/validation');
  };

  const handleBackToHeroClick = () => {
    const heroId = reservationDetails?.id || '1';
    router.push(`/${heroId}`);
  };

  const handleCreateRequest = async () => {
    try {
      const response = await axios.post('/service_requests', {
        ...newRequest,
        user_id: reservationDetails.userId,
        booking_id: reservationDetails.id,
      });
      setServiceRequests([...serviceRequests, response.data]);
      setNewRequest({ name: '', description: '', amount: 0 });
    } catch (error) {
      console.error('Error creating service request:', error);
    }
  };

  const handleUpdateRequest = async (id: number) => {
    try {
      const requestToUpdate = serviceRequests.find(req => req.id === id);
      if (!requestToUpdate) return;

      const response = await axios.put(`/service_requests/${id}`, requestToUpdate);
      setServiceRequests(serviceRequests.map(req => req.id === id ? response.data : req));
      setEditingId(null);
    } catch (error) {
      console.error('Error updating service request:', error);
    }
  };

  const handleDeleteRequest = async (id: number) => {
    try {
      await axios.delete(`/service_requests/${id}`);
      setServiceRequests(serviceRequests.filter(req => req.id !== id));
    } catch (error) {
      console.error('Error deleting service request:', error);
    }
  };

  if (!reservationDetails) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4, position: 'relative' }}>
      <Stack direction="row" justifyContent="flex-start" sx={{ mb: 2 }}>
        <Button onClick={handleBackToHeroClick} variant="contained">
          Page Précédente
        </Button>
      </Stack>
      <Typography sx={{ mb: 4 }} variant="h4">
        Sélectionnez vos prestations
      </Typography>
      <Stack spacing={2}>
        {prestations.map((prestation) => (
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedPrestations.includes(prestation.id)}
                onChange={() => { handleCheckboxChange(prestation.id); }}
              />
            }
            key={prestation.id}
            label={`${prestation.name} - ${prestation.price} €`}
          />
        ))}
        <Box>
          <Typography variant="h6">Ajouter une prestation personnalisée</Typography>
          <TextField
            fullWidth
            label="Prestation"
            onChange={(e) => { setCustomPrestation(e.target.value); }}
            sx={{ mb: 2 }}
            value={customPrestation}
          />
          <TextField
            fullWidth
            label="Prix"
            onChange={(e) => { setCustomPrestationPrice(Number(e.target.value)); }}
            sx={{ mb: 2 }}
            type="number"
            value={customPrestationPrice}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Date et heure"
              onChange={setCustomDate}
              renderInput={(params) => <TextField {...params} sx={{ mb: 2 }} />}
              value={customDate}
            />
            <DateTimePicker
              label="Heure"
              onChange={setCustomTime}
              renderInput={(params) => <TextField {...params} sx={{ mb: 2 }} />}
              value={customTime}
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
        <Button color="primary" onClick={handleReserveClick} variant="contained">
          Réserver
        </Button>
      </Stack>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5">Demandes de service</Typography>
        <Box sx={{ my: 2 }}>
          <TextField
            fullWidth
            label="Nom"
            onChange={(e) => { setNewRequest({ ...newRequest, name: e.target.value }); }}
            sx={{ mb: 1 }}
            value={newRequest.name}
          />
          <TextField
            fullWidth
            label="Description"
            onChange={(e) => { setNewRequest({ ...newRequest, description: e.target.value }); }}
            sx={{ mb: 1 }}
            value={newRequest.description}
          />
          <TextField
            fullWidth
            label="Montant"
            onChange={(e) => { setNewRequest({ ...newRequest, amount: Number(e.target.value) }); }}
            sx={{ mb: 1 }}
            type="number"
            value={newRequest.amount}
          />
          <Button onClick={handleCreateRequest} variant="contained">Ajouter une demande</Button>
        </Box>
        <List>
          {serviceRequests.map((request) => (
            <ListItem
              key={request.id}
              secondaryAction={
                <>
                  <IconButton aria-label="edit" edge="end" onClick={() => { setEditingId(request.id); }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="delete" edge="end" onClick={() => handleDeleteRequest(request.id)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText
                primary={request.name}
                secondary={`${request.description} - ${request.amount}€`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
}