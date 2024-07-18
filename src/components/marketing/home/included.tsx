'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { Star as StarIcon, NavigateBefore as NavigateBeforeIcon, NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker, DateRange } from '@mui/x-date-pickers-pro';
import TextField from '@mui/material/TextField';
import { differenceInDays } from 'date-fns';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useGetProperty } from '@/api/properties';

const extraChargePerPerson = 50;

export function Included(): React.JSX.Element {
  const router = useRouter();
  const { heroId } = useParams();
  const propertyID = parseInt(heroId, 10);

  // Vérifiez que l'ID est un nombre valide
  if (isNaN(propertyID)) {
    return <Typography>Error: Invalid property ID.</Typography>;
  }

  const { property, propertyLoading, propertyError } = useGetProperty(propertyID);

  const [dateRange, setDateRange] = useState<DateRange<Date>>([null, null]);
  const [travelers, setTravelers] = useState<number>(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [propertyImages, setPropertyImages] = useState<string[]>([]);
  const [mapCenter, setMapCenter] = useState<{ lat: number, lng: number } | null>(null);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [numberOfNights, setNumberOfNights] = useState<number>(0);

  useEffect(() => {
    if (property && property.propertyImages) {
      setPropertyImages(property.propertyImages.map(img => img.link));
    }
  }, [property]);

  useEffect(() => {
    if (property) {
      const address = `${property.line1}, ${property.city}, ${property.state}, ${property.country}, ${property.zipCode}`;
      getCoordinatesFromAddress(address).then(coordinates => {
        setMapCenter(coordinates);
      });
    }
  }, [property]);

  useEffect(() => {
    const calculateTotalAmount = () => {
      if (dateRange[0] && dateRange[1] && property) {
        const startDate = new Date(dateRange[0]);
        const endDate = new Date(dateRange[1]);
        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
          const days = differenceInDays(endDate, startDate);
          setNumberOfNights(days);
          const baseAmount = days * Number(property.price);
          const totalAmount = baseAmount * travelers;
          return totalAmount;
        }
      }
      return 0;
    };

    setTotalAmount(calculateTotalAmount());
  }, [dateRange, travelers, property]);

  const getCoordinatesFromAddress = async (address: string) => {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    } else {
      return { lat: 0, lng: 0 };
    }
  };

  const handleReserveClick = () => {
    const startDate = dateRange[0] ? new Date(dateRange[0]).toLocaleDateString() : 'N/A';
    const endDate = dateRange[1] ? new Date(dateRange[1]).toLocaleDateString() : 'N/A';

    const reservationDetails = {
      title: property.title,
      startDate: startDate,
      endDate: endDate,
      price: property.price,
      numberOfNights: numberOfNights,
      totalAmount: totalAmount,
      travelers: travelers,
    };

    localStorage.setItem('reservationDetails', JSON.stringify(reservationDetails));
    router.push('/prestation');
  };

  const handleBackClick = () => {
    router.push('/');
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % (propertyImages.length || 1));
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + (propertyImages.length || 1)) % (propertyImages.length || 1));
  };

  if (propertyLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (propertyError) {
    return <Typography>Error loading property.</Typography>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
              <Grid item xs={12} md={6}>
                {propertyImages.length > 0 ? (
                  <Box sx={{ position: 'relative' }}>
                    <IconButton sx={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', zIndex: 10 }} onClick={handlePrevImage}>
                      <NavigateBeforeIcon />
                    </IconButton>
                    <IconButton sx={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', zIndex: 10 }} onClick={handleNextImage}>
                      <NavigateNextIcon />
                    </IconButton>
                    <Box component="img" 
                        src={propertyImages[currentImageIndex] || '/assets/apartment-city-center.jpg'} 
                        onError={(e) => { e.currentTarget.src = '/assets/apartment-city-center.jpg'; }} 
                        sx={{ width: '100%', height: 'auto', borderRadius: '8px' }} 
                    />
                  </Box>
                ) : (
                  <Box component="img" 
                      src='/assets/apartment-city-center.jpg'
                      sx={{ width: '100%', height: 'auto', borderRadius: '8px' }} 
                  />
                )}
              </Grid>
              <Grid item xs={12} md={6}>
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
                  <TextField
                    label="Nombre de voyageurs"
                    type="number"
                    value={travelers}
                    onChange={(e) => setTravelers(Number(e.target.value))}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="h6">
                    Total: {totalAmount !== null && totalAmount > 0 ? totalAmount + ' €' : 'N/A'}
                  </Typography>
                  <Button variant="contained" color="secondary" onClick={handleReserveClick}>
                    Réserver
                  </Button>
                </Stack>
              </Grid>
            </Grid>
            <Stack spacing={2}>
              <Typography variant="h5">Description</Typography>
              <Typography variant="body1">{property.description}</Typography>
            </Stack>
            <Stack spacing={2}>
              <Typography variant="h5">Équipements inclus</Typography>
              <Grid container spacing={2}>
                {property.facilities && property.facilities.length > 0 ? (
                  property.facilities.map((facility, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Typography variant="body1">{facility.name}</Typography>
                    </Grid>
                  ))
                ) : (
                  <Typography variant="body1">Aucun équipement inclus.</Typography>
                )}
              </Grid>
            </Stack>
            <Typography variant="h5">Où se situe le logement</Typography>
            <Typography variant="body1">{property.line1}, {property.city}, {property.state}, {property.country}, {property.zipCode}</Typography>
            <Box sx={{ height: '400px', mt: 4 }}>
              <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
                {mapCenter && (
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={mapCenter}
                    zoom={15}
                  >
                    <Marker position={mapCenter} /> {/* Add Marker */}
                  </GoogleMap>
                )}
              </LoadScript>
            </Box>
          </Stack>
        </Container>
      </Box>
    </LocalizationProvider>
  );
}
