"use client";

import * as React from 'react';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import PublicIcon from '@mui/icons-material/Public';
import LoginIcon from '@mui/icons-material/Login';
import TuneIcon from '@mui/icons-material/Tune';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import HomeIcon from '@mui/icons-material/Home';
import NaturePeopleIcon from '@mui/icons-material/NaturePeople';
import CabinIcon from '@mui/icons-material/Cabin';
import CastleIcon from '@mui/icons-material/Castle';
import ApartmentIcon from '@mui/icons-material/Apartment';
import HotelIcon from '@mui/icons-material/Hotel';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useGetFacilities } from '@/api/facilities';
import 'react-datepicker/dist/react-datepicker.css';
import { GridList2 } from '@/components/widgets/grid-lists/grid-list-2';

export function MainNav(): React.JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const { facilities, facilitiesLoading, facilitiesError } = useGetFacilities(); // Utiliser le hook pour récupérer les facilités

  const [anchorElLanguage, setAnchorElLanguage] = useState<null | HTMLElement>(null);
  const [anchorElLogin, setAnchorElLogin] = useState<null | HTMLElement>(null);
  const [anchorElDateRange, setAnchorElDateRange] = useState<null | HTMLElement>(null);
  const [anchorElTravelers, setAnchorElTravelers] = useState<null | HTMLElement>(null);
  const [anchorElFilters, setAnchorElFilters] = useState<null | HTMLElement>(null);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [travelers, setTravelers] = useState({ adults: 1, children: 0, babies: 0, pets: 0 });

  // États pour les filtres
  const [selectedType, setSelectedType] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [selectedBedrooms, setSelectedBedrooms] = useState<number | null>(null);
  const [selectedBeds, setSelectedBeds] = useState<number | null>(null);
  const [selectedFacilities, setSelectedFacilities] = useState<number[]>([]);

  const handleFiltersClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElFilters(event.currentTarget);
  };

  const handleFiltersClose = () => {
    setAnchorElFilters(null);
  };

  const handleSearch = () => {
    const query = {
      type: selectedType,
      minPrice,
      maxPrice,
      bedrooms: selectedBedrooms,
      beds: selectedBeds,
      facilities: selectedFacilities,
    };
    router.push({
      pathname: '/search',
      query,
    });
  };

  const handleFacilityChange = (id: number) => {
    setSelectedFacilities((prev) =>
      prev.includes(id) ? prev.filter((facilityId) => facilityId !== id) : [...prev, id]
    );
  };

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          backgroundColor: 'var(--mui-palette-background-default)',
          color: 'var(--mui-palette-text-primary)',
          boxShadow: '0px 1px 5px rgb(0, 0, 0)',
          borderBottom: '1px solid var(--mui-palette-divider)',
          position: 'sticky',
          top: 0,
          width: '100%',
          zIndex: 1100,
        }}
      >
        <Container
          maxWidth="xl"
          sx={{ display: 'flex', flexDirection: 'column', py: '8px' }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: '100%' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button href="/" sx={{ color: 'inherit', display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" noWrap sx={{ fontWeight: 'bold', color: '#FF385C' }}>
                  ParisCareTaker
                </Typography>
              </Button>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: '50px',
                boxShadow: '0px 1px 5px rgb(0, 0, 0)',
                p: 1,
                width: '100%',
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              <TextField
                variant="outlined"
                placeholder="Destination"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  sx: { border: 'none', outline: 'none' },
                }}
                sx={{ flexGrow: 1, mx: 1 }}
              />
              <Divider orientation="vertical" flexItem />
              <TextField
                variant="outlined"
                placeholder="Arrivée"
                size="small"
                onClick={handleFiltersClick}
                value={startDate ? startDate.toLocaleDateString() : ''}
                InputProps={{ readOnly: true }}
                sx={{ flexGrow: 1, mx: 1 }}
              />
              <Divider orientation="vertical" flexItem />
              <TextField
                variant="outlined"
                placeholder="Départ"
                size="small"
                value={endDate ? endDate.toLocaleDateString() : ''}
                InputProps={{ readOnly: true }}
                sx={{ flexGrow: 1, mx: 1 }}
              />
              <Divider orientation="vertical" flexItem />
              <TextField
                variant="outlined"
                placeholder="Voyageurs"
                size="small"
                value={`${travelers.adults + travelers.children} voyageurs`}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PeopleIcon />
                    </InputAdornment>
                  ),
                  readOnly: true,
                }}
                sx={{ flexGrow: 1, mx: 1 }}
              />
              <Button
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                sx={{ bgcolor: '#FF385C', color: 'white', borderRadius: '50px', '&:hover': { bgcolor: '#FF385C' } }}
              >
                Rechercher
              </Button>
            </Box>

            <Stack direction="row" spacing={1} alignItems="center">
              <Button href="/sign-up" variant="contained" sx={{ bgcolor: '#FF385C', color: 'white', borderRadius: '50px', '&:hover': { bgcolor: '#FF385C' } }}>
                Mettre mon logement sur Airbnb
              </Button>
              <IconButton sx={{ color: 'text.secondary' }}>
                <PublicIcon />
              </IconButton>
              <Popover
                id="language-popover"
                open={Boolean(anchorElLanguage)}
                anchorEl={anchorElLanguage}
                onClose={() => setAnchorElLanguage(null)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <Box sx={{ p: 2 }}>
                  <Typography variant="body1">Sélectionner la langue</Typography>
                  {/* Ajouter les options de sélection de langue ici */}
                </Box>
              </Popover>

              <IconButton sx={{ color: 'text.secondary' }} href="/sign-in" variant="contained">
                <LoginIcon />
              </IconButton>
            </Stack>
          </Stack>

          <Box sx={{ mt: 2, width: '100%' }}>
            <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
              <Button>
                <HomeIcon fontSize="large" />
                <Typography variant="caption">Maison</Typography>
              </Button>
              <Button>
                <ApartmentIcon fontSize="large" />
                <Typography variant="caption">Appartement</Typography>
              </Button>
              <Button>
                <HotelIcon fontSize="large" />
                <Typography variant="caption">Hôtel</Typography>
              </Button>
              <Button>
                <NaturePeopleIcon fontSize="large" />
                <Typography variant="caption">Campagne</Typography>
              </Button>
              <Button>
                <CabinIcon fontSize="large" />
                <Typography variant="caption">Cabane</Typography>
              </Button>
              <Button>
                <CastleIcon fontSize="large" />
                <Typography variant="caption">Château</Typography>
              </Button>
              <Button>
                <BeachAccessIcon fontSize="large" />
                <Typography variant="caption">Bord de mer</Typography>
              </Button>
              <Button>
                <TuneIcon fontSize="large" onClick={handleFiltersClick} />
                <Typography variant="caption">Filtres</Typography>
              </Button>
            </Stack>
          </Box>
        </Container>

        <Popover
          id="filters-popover"
          open={Boolean(anchorElFilters)}
          anchorEl={anchorElFilters}
          onClose={handleFiltersClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Box sx={{ p: 3, width: '400px' }}>
            <Typography variant="h6">Filtres</Typography>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>Type de logement</Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <Button variant={selectedType === 'all' ? 'contained' : 'outlined'} onClick={() => setSelectedType('all')}>Tous les types</Button>
              <Button variant={selectedType === 'room' ? 'contained' : 'outlined'} onClick={() => setSelectedType('room')}>Chambre</Button>
              <Button variant={selectedType === 'entire' ? 'contained' : 'outlined'} onClick={() => setSelectedType('entire')}>Logement entier</Button>
            </Stack>

            <Typography variant="subtitle1" sx={{ mt: 2 }}>Fourchette de prix</Typography>
            <Box sx={{ mt: 1 }}>
              <TextField label="Minimum" variant="outlined" size="small" sx={{ width: '100px', mr: 1 }} value={minPrice || ''} onChange={(e) => setMinPrice(Number(e.target.value))} />
              <TextField label="Maximum" variant="outlined" size="small" sx={{ width: '100px' }} value={maxPrice || ''} onChange={(e) => setMaxPrice(Number(e.target.value))} />
            </Box>

            <Typography variant="subtitle1" sx={{ mt: 2 }}>Chambres et lits</Typography>
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2">Chambres</Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Button variant={!selectedBedrooms ? 'contained' : 'outlined'} onClick={() => setSelectedBedrooms(null)}>Tout</Button>
                {[1, 2, 3, 4, 5, '6+'].map((num) => (
                  <Button key={num} variant={selectedBedrooms === num ? 'contained' : 'outlined'} onClick={() => setSelectedBedrooms(num)}>{num}</Button>
                ))}
              </Stack>
              <Typography variant="body2" sx={{ mt: 2 }}>Lits</Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Button variant={!selectedBeds ? 'contained' : 'outlined'} onClick={() => setSelectedBeds(null)}>Tout</Button>
                {[1, 2, 3, 4, 5, '6+'].map((num) => (
                  <Button key={num} variant={selectedBeds === num ? 'contained' : 'outlined'} onClick={() => setSelectedBeds(num)}>{num}</Button>
                ))}
              </Stack>
            </Box>

            <Typography variant="subtitle1" sx={{ mt: 2 }}>Facilités</Typography>
            <Box sx={{ mt: 1 }}>
              {facilities.map((facility) => (
                <FormControlLabel
                  key={facility.id}
                  control={<Checkbox checked={selectedFacilities.includes(facility.id)} onChange={() => handleFacilityChange(facility.id)} />}
                  label={facility.name}
                  sx={{ display: 'block', mt: 1 }}
                />
              ))}
            </Box>
          </Box>
        </Popover>
      </Box>

      <GridList2 filters={{ type: selectedType, minPrice, maxPrice, bedrooms: selectedBedrooms, beds: selectedBeds, facilities: selectedFacilities }} />
    </React.Fragment>
  );
}
