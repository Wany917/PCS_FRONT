"use client";
import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import { Star as StarIcon, NavigateBefore as NavigateBeforeIcon, NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { apartmentData } from '@/app/apartmentData';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateRangePicker, DateRange } from '@mui/x-date-pickers-pro';
import TextField from '@mui/material/TextField';
import { differenceInDays } from 'date-fns';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const extraChargePerPerson = 50;

export function Included(): React.JSX.Element {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<DateRange<Date>>([null, null]);
  const [travelers, setTravelers] = useState<number>(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const calculateTotalAmount = () => {
    if (dateRange[0] && dateRange[1]) {
      const days = differenceInDays(dateRange[1], dateRange[0]);
      const baseAmount = days * Number(apartmentData.price);
      const totalAmount = baseAmount * travelers;
      return totalAmount;
    }
    return 0;
  };

  const handleReserveClick = () => {
    alert(`Réservation pour ${apartmentData.title} du ${dateRange[0]?.toLocaleDateString()} au ${dateRange[1]?.toLocaleDateString()} pour ${calculateTotalAmount()} € avec ${travelers} voyageurs`);
    router.push('/prestation');
  };

  const handleBackClick = () => {
    router.push('/');
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % apartmentData.images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + apartmentData.images.length) % apartmentData.images.length);
  };

  return (
    <Box sx={{ overflow: 'hidden', py: '120px', position: 'relative' }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Box sx={{ position: 'absolute', top: '20px', left: '20px' }}>
            <Button variant="contained" onClick={handleBackClick}>
              Page Précédente
            </Button>
          </Box>
          <Typography variant="h4">{apartmentData.title}</Typography>
          <Grid container spacing={2}>
            <Grid xs={12} md={6}>
              <Box sx={{ position: 'relative' }}>
                <IconButton sx={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', zIndex: 10 }} onClick={handlePrevImage}>
                  <NavigateBeforeIcon />
                </IconButton>
                <IconButton sx={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', zIndex: 10 }} onClick={handleNextImage}>
                  <NavigateNextIcon />
                </IconButton>
                <Box component="img" src={apartmentData.images[currentImageIndex]} sx={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
              </Box>
            </Grid>
            <Grid xs={12} md={6}>
              <Stack spacing={2}>
                <Typography variant="body1">{apartmentData.description}</Typography>
                <Typography variant="h6">{apartmentData.price} € par voyageurs</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <StarIcon sx={{ color: '#ffb400' }} />
                  <Typography variant="body1" sx={{ marginLeft: '8px' }}>
                    {apartmentData.rating} ({apartmentData.reviews} commentaires)
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  {apartmentData.features.map((feature, index) => (
                    <Chip key={index} label={feature} variant="outlined" />
                  ))}
                </Stack>
                <Box>
                  <Typography variant="body2">{apartmentData.host.name}</Typography>
                  <Typography variant="body2">{apartmentData.host.since}</Typography>
                </Box>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateRangePicker
                    startText="Arrivée"
                    endText="Départ"
                    value={dateRange}
                    onChange={(newValue) => setDateRange(newValue)}
                    textField={(params) => (
                      <React.Fragment>
                        <TextField {...params.startProps} />
                        <Box sx={{ mx: 2 }}> au </Box>
                        <TextField {...params.endProps} />
                      </React.Fragment>
                    )}
                  />
                </LocalizationProvider>
                <TextField
                  label="Nombre de voyageurs"
                  type="number"
                  value={travelers}
                  onChange={(e) => setTravelers(Number(e.target.value))}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <Typography variant="h6">
                  Total: {calculateTotalAmount()} €
                </Typography>
                <Button variant="contained" color="secondary" onClick={handleReserveClick}>
                  Réserver
                </Button>
              </Stack>
            </Grid>
          </Grid>
          <Stack spacing={2}>
            <Typography variant="h5">Description</Typography>
            <Typography variant="body1">{apartmentData.longDescription}</Typography>
          </Stack>
          <Stack spacing={2}>
            <Typography variant="h5">Équipements inclus</Typography>
            <Grid container spacing={2}>
              {apartmentData.amenities.map((amenity, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Typography variant="body1">{amenity}</Typography>
                </Grid>
              ))}
            </Grid>
          </Stack>
          <Typography variant="h5">Où se situe le logement</Typography>
          <Typography variant="body1">{apartmentData.location.address}</Typography>
          <Box sx={{ height: '400px', mt: 4 }}>
            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={{ lat: apartmentData.location.lat, lng: apartmentData.location.lng }}
                zoom={15}
              />
            </LoadScript>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
