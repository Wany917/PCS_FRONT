'use client';
import * as React from 'react';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
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
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import HomeIcon from '@mui/icons-material/Home';
import ApartmentIcon from '@mui/icons-material/Apartment';
import NaturePeopleIcon from '@mui/icons-material/NaturePeople';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import CabinIcon from '@mui/icons-material/Cabin';
import CastleIcon from '@mui/icons-material/Castle';
import HotelIcon from '@mui/icons-material/Hotel';
import { useGetFacilities } from '@/api/facilities';

export function MainNav(): React.JSX.Element {
  const pathname = usePathname();
  const [anchorElLanguage, setAnchorElLanguage] = React.useState<null | HTMLElement>(null);
  const [anchorElLogin, setAnchorElLogin] = React.useState<null | HTMLElement>(null);
  const [anchorElDateRange, setAnchorElDateRange] = React.useState<null | HTMLElement>(null);
  const [anchorElTravelers, setAnchorElTravelers] = React.useState<null | HTMLElement>(null);
  const [anchorElFilters, setAnchorElFilters] = React.useState<null | HTMLElement>(null);
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const [travelers, setTravelers] = React.useState({ adults: 1, children: 0, babies: 0, pets: 0 });
  const { facilities, facilitiesLoading, facilitiesError } = useGetFacilities();
  const [showMoreFacilities, setShowMoreFacilities] = React.useState(false);

  const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElLanguage(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setAnchorElLanguage(null);
  };

  const handleLoginClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElLogin(event.currentTarget);
  };

  const handleLoginClose = () => {
    setAnchorElLogin(null);
  };

  const handleDateRangeClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElDateRange(event.currentTarget);
  };

  const handleDateRangeClose = () => {
    setAnchorElDateRange(null);
  };

  const handleTravelersClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElTravelers(event.currentTarget);
  };

  const handleTravelersClose = () => {
    setAnchorElTravelers(null);
  };

  const handleFiltersClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElFilters(event.currentTarget);
  };

  const handleFiltersClose = () => {
    setAnchorElFilters(null);
  };

  const toggleShowMoreFacilities = () => {
    setShowMoreFacilities((prev) => !prev);
  };

  const openLanguage = Boolean(anchorElLanguage);
  const idLanguage = openLanguage ? 'language-popover' : undefined;

  const openLogin = Boolean(anchorElLogin);
  const idLogin = openLogin ? 'login-popover' : undefined;

  const openDateRange = Boolean(anchorElDateRange);
  const idDateRange = openDateRange ? 'date-range-popover' : undefined;

  const openTravelers = Boolean(anchorElTravelers);
  const idTravelers = openTravelers ? 'travelers-popover' : undefined;

  const openFilters = Boolean(anchorElFilters);
  const idFilters = openFilters ? 'filters-popover' : undefined;

  const handleTravelerChange = (type: string, operation: 'increment' | 'decrement') => {
    setTravelers((prev) => {
      const newValue = operation === 'increment' ? prev[type] + 1 : prev[type] - 1;
      return {
        ...prev,
        [type]: Math.max(0, newValue),
      };
    });
  };

  if (facilitiesLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (facilitiesError) {
    return <Typography>Error loading facilities.</Typography>;
  }

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
              <Button component={RouterLink} href={'/'} sx={{ color: 'inherit', display: 'flex', alignItems: 'center' }}>
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
                onClick={handleDateRangeClick}
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
                onClick={handleTravelersClick}
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
                sx={{ bgcolor: '#FF385C', color: 'white', borderRadius: '50px', '&:hover': { bgcolor: '#FF385C' } }}
              >
                Rechercher
              </Button>
            </Box>

            <Stack direction="row" spacing={1} alignItems="center">
              <Button component={RouterLink} href={'/auth/sign-up'} variant="contained" sx={{ bgcolor: '#FF385C', color: 'white', borderRadius: '50px', '&:hover': { bgcolor: '#FF385C' } }}>
                Mettre mon logement sur Airbnb
              </Button>
              <IconButton sx={{ color: 'text.secondary' }} onClick={handleLanguageClick}>
                <PublicIcon />
              </IconButton>
              <Popover
                id={idLanguage}
                open={openLanguage}
                anchorEl={anchorElLanguage}
                onClose={handleLanguageClose}
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
                  <Typography variant="h6">Langues</Typography>
                  <Button fullWidth>Français</Button>
                  <Button fullWidth>English</Button>
                  <Button fullWidth>Español</Button>
                </Box>
              </Popover>

              <IconButton sx={{ color: 'text.secondary' }} component={RouterLink} href={'/auth/sign-in'} variant="contained">
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
          id={idDateRange}
          open={openDateRange}
          anchorEl={anchorElDateRange}
          onClose={handleDateRangeClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Box sx={{ p: 3 }}>
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => {
                const [start, end] = update;
                setStartDate(start);
                setEndDate(end);
              }}
              isClearable={true}
              inline
            />
          </Box>
        </Popover>

        <Popover
          id={idTravelers}
          open={openTravelers}
          anchorEl={anchorElTravelers}
          onClose={handleTravelersClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Box sx={{ p: 3, width: '300px' }}>
            {['adults', 'children', 'babies', 'pets'].map((type) => (
              <Box key={type} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="subtitle1">
                    {type === 'adults' && 'Adultes'}
                    {type === 'children' && 'Enfants'}
                    {type === 'babies' && 'Bébés'}
                    {type === 'pets' && 'Animaux domestiques'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {type === 'adults' && '13 ans et plus'}
                    {type === 'children' && 'De 2 à 12 ans'}
                    {type === 'babies' && 'Moins de 2 ans'}
                    {type === 'pets' && 'Vous voyagez avec un animal d\'assistance ?'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleTravelerChange(type, 'decrement')}
                  >
                    -
                  </Button>
                  <Typography variant="body2" sx={{ mx: 2 }}>
                    {travelers[type]}
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleTravelerChange(type, 'increment')}
                  >
                    +
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        </Popover>

        <Popover
          id={idFilters}
          open={openFilters}
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
              <Button variant="outlined">Tous les types</Button>
              <Button variant="outlined">Chambre</Button>
              <Button variant="outlined">Logement entier</Button>
            </Stack>

            <Typography variant="subtitle1" sx={{ mt: 2 }}>Fourchette de prix</Typography>
            <Box sx={{ mt: 1 }}>
              <TextField label="Minimum" variant="outlined" size="small" sx={{ width: '100px', mr: 1 }} />
              <TextField label="Maximum" variant="outlined" size="small" sx={{ width: '100px' }} />
            </Box>

            <Typography variant="subtitle1" sx={{ mt: 2 }}>Chambres et lits</Typography>
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2">Chambres</Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Button variant="outlined">Tout</Button>
                {[1, 2, 3, 4, 5, '6+'].map((num) => (
                  <Button key={num} variant="outlined">{num}</Button>
                ))}
              </Stack>
              <Typography variant="body2" sx={{ mt: 2 }}>Lits</Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Button variant="outlined">Tout</Button>
                {[1, 2, 3, 4, 5, '6+'].map((num) => (
                  <Button key={num} variant="outlined">{num}</Button>
                ))}
              </Stack>
            </Box>

            <Typography variant="subtitle1" sx={{ mt: 2 }}>Facilités</Typography>
            <Box sx={{ mt: 1 }}>
              {facilities.slice(0, 6).map((facility) => (
                <FormControlLabel
                  key={facility.id}
                  control={<Checkbox />}
                  label={facility.name}
                  sx={{ display: 'block', mt: 1 }}
                />
              ))}
              {!showMoreFacilities && (
                <Button onClick={toggleShowMoreFacilities} sx={{ mt: 2 }}>
                  Afficher plus
                </Button>
              )}
              {showMoreFacilities && (
                <>
                  {facilities.slice(6).map((facility) => (
                    <FormControlLabel
                      key={facility.id}
                      control={<Checkbox />}
                      label={facility.name}
                      sx={{ display: 'block', mt: 1 }}
                    />
                  ))}
                  <Button onClick={toggleShowMoreFacilities} sx={{ mt: 2 }}>
                    Afficher moins
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Popover>
      </Box>
    </React.Fragment>
  );
}
