"use client";

import * as React from 'react';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import { Star as StarIcon, NavigateBefore as NavigateBeforeIcon, NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker, DateRange } from '@mui/x-date-pickers-pro';
import TextField from '@mui/material/TextField';
import { differenceInDays } from 'date-fns';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { useGetProperty } from '@/api/properties';

const extraChargePerPerson = 50;

export function Included(): React.JSX.Element {
  const router = useRouter();
  const { heroId } = useParams();
  const propertyID = parseInt(heroId, 10);
  console.log(heroId);

  // Vérifiez que l'ID est un nombre valide
  if (isNaN(propertyID)) {
    return <Typography>Error: Invalid property ID.</Typography>;
  }

  const { property, propertyLoading, propertyError } = useGetProperty(propertyID);

  console.log(`Property data:`, property); // Log les données de la propriété
  console.log(`Property loading:`, propertyLoading); // Log l'état de chargement
  console.log(`Property error:`, propertyError); // Log l'état d'erreur

  const [dateRange, setDateRange] = useState<DateRange<Date>>([null, null]);
  const [travelers, setTravelers] = useState<number>(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const calculateTotalAmount = () => {
    if (dateRange[0] && dateRange[1]) {
      const days = differenceInDays(dateRange[1], dateRange[0]);
      const baseAmount = days * Number(property.price);
      const totalAmount = baseAmount * travelers;
      return totalAmount;
    }
    return 0;
  };

  const handleReserveClick = () => {
    alert(`Réservation pour ${property.title} du ${dateRange[0]?.toLocaleDateString()} au ${dateRange[1]?.toLocaleDateString()} pour ${calculateTotalAmount()} € avec ${travelers} voyageurs`);
    router.push('/prestation');
  };

  const handleBackClick = () => {
    router.push('/');
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % (property.propertyImages.length || 1));
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + (property.propertyImages.length || 1)) % (property.propertyImages.length || 1));
  };

  if (propertyLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (propertyError) {
    return <Typography>Error loading property.</Typography>;
  }

  return (
    <Box sx={{ overflow: 'hidden', py: '120px', position: 'relative' }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Box sx={{ position: 'absolute', top: '20px', left: '20px' }}>
            <Button variant="contained" onClick={handleBackClick}>
              Page Précédente
            </Button>
          </Box>
          <Typography variant="h4">{property.title}</Typography>
          <Grid container spacing={2}>
            <Grid xs={12} md={6}>
              {property.propertyImages && property.propertyImages.length > 0 && (
                <Box sx={{ position: 'relative' }}>
                  <IconButton sx={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', zIndex: 10 }} onClick={handlePrevImage}>
                    <NavigateBeforeIcon />
                  </IconButton>
                  <IconButton sx={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', zIndex: 10 }} onClick={handleNextImage}>
                    <NavigateNextIcon />
                  </IconButton>
                  <Box component="img" 
                       src={property.propertyImages[currentImageIndex]?.link || '/assets/apartment-city-center.jpg'} 
                       onError={(e) => { e.currentTarget.src = '/assets/apartment-city-center.jpg'; }} 
                       sx={{ width: '100%', height: 'auto', borderRadius: '8px' }} 
                  />
                </Box>
              )}
            </Grid>
            <Grid xs={12} md={6}>
              <Stack spacing={2}>
                <Typography variant="body1">{property.description}</Typography>
                <Typography variant="h6">{property.price} € par voyageur</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <StarIcon sx={{ color: '#ffb400' }} />
                  <Typography variant="body1" sx={{ marginLeft: '8px' }}>
                    {property.rating} ({property.reviews} commentaires)
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  {property.features?.map((feature, index) => (
                    <Chip key={index} label={feature} variant="outlined" />
                  ))}
                </Stack>
                <Box>
                  <Typography variant="body2">{property.host?.name}</Typography>
                  <Typography variant="body2">{property.host?.since}</Typography>
                </Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateRangePicker
                    startText="Arrivée"
                    endText="Départ"
                    value={dateRange}
                    onChange={(newValue) => setDateRange(newValue)}
                    renderInput={(startProps, endProps) => (
                      <React.Fragment>
                        <TextField {...startProps} />
                        <Box sx={{ mx: 2 }}> au </Box>
                        <TextField {...endProps} />
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
            <Typography variant="body1">{property.longDescription}</Typography>
          </Stack>
          <Stack spacing={2}>
            <Typography variant="h5">Équipements inclus</Typography>
            <Grid container spacing={2}>
              {property.amenities?.map((amenity, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Typography variant="body1">{amenity}</Typography>
                </Grid>
              ))}
            </Grid>
          </Stack>
          <Typography variant="h5">Où se situe le logement</Typography>
          <Typography variant="body1">{property.location?.address}</Typography>
          <Box sx={{ height: '400px', mt: 4 }}>
            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={{ lat: property.location?.lat, lng: property.location?.lng }}
                zoom={15}
              />
            </LoadScript>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
