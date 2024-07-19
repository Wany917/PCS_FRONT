import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { dayjs } from '@/lib/dayjs';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

interface Prestation {
  id: number;
  name: string;
  description: string;
  amount: number;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'rejected';
  createdAt: string;
  address: string; 
  location: string; 
  clientName: string; 
  userId: number;
  bookingId: number;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'accepted':
      return 'info';
    case 'in-progress':
      return 'primary';
    case 'completed':
      return 'success';
    case 'rejected':
      return 'error';
    default:
      return 'default';
  }
};

export function GridList7(): React.JSX.Element {
  const [prestations, setPrestations] = useState<Prestation[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [selectedPrestation, setSelectedPrestation] = useState<Prestation | null>(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Prestation['status']>('pending');
  const [amount, setAmount] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'in-progress' | 'completed' | 'rejected'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPrestations();
  }, []);

  const fetchPrestations = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/service_requests');
      const data = Array.isArray(response.data) ? response.data : [];
      setPrestations(data);
      setServiceRequests(data); 
    } catch (error) {
      console.error('Error fetching prestations:', error);
      setPrestations([]);
      setServiceRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPrestation) {
      setStatus(selectedPrestation.status);
      setAmount(selectedPrestation.amount);
      setComment('');
    }
  }, [selectedPrestation]);

  const handleOpen = (prestation: Prestation) => {
    setSelectedPrestation(prestation);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPrestation(null);
  };

  const handleSave = async () => {
    if (selectedPrestation) {
      try {
        const updatedPrestation = {
          ...selectedPrestation,
          status,
          amount,
        };
        await axios.put(`/service_requests/${selectedPrestation.id}`, updatedPrestation);
        fetchPrestations(); // Refresh the list after update
        handleClose();
      } catch (error) {
        console.error('Error updating prestation:', error);
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/service_requests/${id}`);
      fetchPrestations(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting prestation:', error);
    }
  };

  const handleFilterChange = (event: React.SyntheticEvent, newValue: 'all' | 'pending' | 'accepted' | 'in-progress' | 'completed' | 'rejected') => {
    setFilter(newValue);
  };

  const filteredPrestations = Array.isArray(prestations) 
  ? (filter === 'all' 
    ? prestations 
    : prestations.filter(prestation => prestation.status === filter))
  : [];

  return (
    <Box sx={{ bgcolor: 'var(--mui-palette-background-level1)', p: 3 }}>
      <Typography gutterBottom variant="h4">
        Prestations personnalisées
      </Typography>
      <Tabs aria-label="prestation filters" onChange={handleFilterChange} sx={{ mb: 2 }} value={filter}>
        <Tab label="Toutes" value="all" />
        <Tab label="En attente" value="pending" />
        <Tab label="Acceptées" value="accepted" />
        <Tab label="En cours" value="in-progress" />
        <Tab label="Complétées" value="completed" />
        <Tab label="Rejetées" value="rejected" />
      </Tabs>
      <Grid container spacing={3}>
        {filteredPrestations.map((prestation) => (
          <Grid key={prestation.id} md={4} sm={6} xs={12}>
            <PrestationCard onClick={() => { handleOpen(prestation); }} onDelete={() => handleDelete(prestation.id)} prestation={prestation} />
          </Grid>
        ))}
      </Grid>
      <Modal onClose={handleClose} open={open}>
        <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 1, width: '80%', maxWidth: '600px', margin: 'auto', mt: 10 }}>
          {selectedPrestation ? <>
              <Typography variant="h6">{selectedPrestation.name}</Typography>
              <Typography color="text.secondary" sx={{ marginY: 2 }} variant="body2">
                {selectedPrestation.description}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Client: {selectedPrestation.clientName}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Adresse: {selectedPrestation.address}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Emplacement: {selectedPrestation.location}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Montant actuel: {selectedPrestation.amount} €
              </Typography>
              <Typography color="text.secondary" sx={{ marginBottom: 2 }} variant="body2">
                Statut actuel:
                <Chip color={getStatusColor(selectedPrestation.status)} label={selectedPrestation.status} sx={{ ml: 1 }} />
              </Typography>
              <TextField
                fullWidth
                label="Nouveau montant"
                onChange={(e) => { setAmount(Number(e.target.value)); }}
                sx={{ marginBottom: 2 }}
                type="number"
                value={amount}
              />
              <TextField
                SelectProps={{
                  native: true,
                }}
                fullWidth
                label="Nouveau statut"
                onChange={(e) => { setStatus(e.target.value as Prestation['status']); }}
                select
                sx={{ marginBottom: 2 }}
                value={status}
              >
                <option value="pending">En attente</option>
                <option value="accepted">Accepté</option>
                <option value="in-progress">En cours</option>
                <option value="completed">Complété</option>
                <option value="rejected">Rejeté</option>
              </TextField>
              <TextField
                fullWidth
                label="Commentaire"
                multiline
                onChange={(e) => { setComment(e.target.value); }}
                rows={4}
                sx={{ marginBottom: 2 }}
                value={comment}
              />
              <Stack direction="row" spacing={2}>
                <Button color="primary" onClick={handleSave} variant="contained">
                  Enregistrer
                </Button>
                <Button onClick={handleClose} variant="outlined">
                  Annuler
                </Button>
              </Stack>
            </> : null}
        </Box>
      </Modal>
    </Box>
  );
}

interface PrestationCardProps {
  prestation: Prestation;
  onClick: () => void;
  onDelete: () => void;
}

function PrestationCard({ prestation, onClick, onDelete }: PrestationCardProps): React.JSX.Element {
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        cursor: 'pointer',
        transition: 'box-shadow 0.3s ease-in-out',
        '&:hover': {
          boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      <CardContent onClick={onClick}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Avatar>{prestation.name.charAt(0)}</Avatar>
          <div>
            <Typography color="text.primary" variant="subtitle1">
              {prestation.name}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Créé {dayjs(prestation.createdAt).fromNow()}
            </Typography>
          </div>
        </Stack>
        <Typography color="text.secondary" sx={{ marginY: 2 }} variant="body2">
          {prestation.description}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          Client: {prestation.clientName}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          Adresse: {prestation.address}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          Emplacement: {prestation.location}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          Montant: {prestation.amount} €
        </Typography>
        <Typography color="text.secondary" variant="body2">
          Statut:
          <Chip
            color={getStatusColor(prestation.status)}
            label={prestation.status}
            sx={{ ml: 1 }}
          />
        </Typography>
      </CardContent>
      <Button color="error" onClick={onDelete}>Supprimer</Button>
    </Card>
  );
}