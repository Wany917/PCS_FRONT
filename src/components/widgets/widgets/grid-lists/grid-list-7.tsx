'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { dayjs } from '@/lib/dayjs';

interface Prestation {
  id: number;
  title: string;
  description: string;
  amount: number;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'rejected';
  createdAt: Date;
  address: string; 
  location: string; 
  clientName: string; 
}

const samplePrestations: Prestation[] = [
  {
    id: 1,
    title: 'Nettoyage après événement',
    description: 'Nettoyage complet après une soirée privée',
    amount: 100,
    status: 'pending',
    createdAt: dayjs().subtract(1, 'day').toDate(),
    address: '123 Rue de Paris, Paris, France',
    location: 'Paris',
    clientName: 'Jean Dupont',
  },
  {
    id: 2,
    title: 'Transport de matériel',
    description: 'Transport de matériel de bureau vers un nouvel emplacement',
    amount: 200,
    status: 'in-progress',
    createdAt: dayjs().subtract(3, 'days').toDate(),
    address: '456 Avenue des Champs-Élysées, Paris, France',
    location: 'Paris',
    clientName: 'Marie Curie',
  },
  {
    id: 3,
    title: 'Transport de matériel',
    description: 'Transport de matériel de bureau vers un nouvel emplacement',
    amount: 200,
    status: 'accepted',
    createdAt: dayjs().subtract(3, 'days').toDate(),
    address: '789 Boulevard Saint-Germain, Paris, France',
    location: 'Paris',
    clientName: 'Albert Einstein',
  },
  {
    id: 4,
    title: 'Transport de matériel',
    description: 'Transport de matériel de bureau vers un nouvel emplacement',
    amount: 200,
    status: 'completed',
    createdAt: dayjs().subtract(3, 'days').toDate(),
    address: '101 Rue de Rivoli, Paris, France',
    location: 'Paris',
    clientName: 'Isaac Newton',
  },
  {
    id: 5,
    title: 'Déménagement',
    description: 'Déménagement complet avec emballage et transport',
    amount: 500,
    status: 'rejected',
    createdAt: dayjs().subtract(2, 'days').toDate(),
    address: '5 Boulevard Voltaire, Paris, France',
    location: 'Paris',
    clientName: 'Nicolas Tesla',
  },
];

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
  const [prestations, setPrestations] = useState<Prestation[]>(samplePrestations);
  const [selectedPrestation, setSelectedPrestation] = useState<Prestation | null>(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Prestation['status']>('pending');
  const [amount, setAmount] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

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

  const handleSave = () => {
    if (selectedPrestation) {
      const updatedPrestations = prestations.map((prest) =>
        prest.id === selectedPrestation.id
          ? { ...prest, status, amount }
          : prest
      );
      setPrestations(updatedPrestations);
      handleClose();
    }
  };

  return (
    <Box sx={{ bgcolor: 'var(--mui-palette-background-level1)', p: 3 }}>
      <Grid container spacing={3}>
        {prestations.map((prestation) => (
          <Grid key={prestation.id} md={4} sm={6} xs={12}>
            <PrestationCard prestation={prestation} onClick={() => handleOpen(prestation)} />
          </Grid>
        ))}
      </Grid>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 1, width: '80%', maxWidth: '600px', margin: 'auto', mt: 10 }}>
          {selectedPrestation && (
            <>
              <Typography variant="h6">{selectedPrestation.title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ marginY: 2 }}>
                {selectedPrestation.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Client: {selectedPrestation.clientName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Adresse: {selectedPrestation.address}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Emplacement: {selectedPrestation.location}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Montant actuel: {selectedPrestation.amount} €
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
                Statut actuel:
                <Chip label={selectedPrestation.status} color={getStatusColor(selectedPrestation.status)} sx={{ ml: 1 }} />
              </Typography>
              <TextField
                fullWidth
                label="Nouveau montant"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                fullWidth
                select
                label="Nouveau statut"
                value={status}
                onChange={(e) => setStatus(e.target.value as Prestation['status'])}
                SelectProps={{
                  native: true,
                }}
                sx={{ marginBottom: 2 }}
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
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <Stack direction="row" spacing={2}>
                <Button variant="contained" color="primary" onClick={handleSave}>
                  Enregistrer
                </Button>
                <Button variant="outlined" onClick={handleClose}>
                  Annuler
                </Button>
              </Stack>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}

interface PrestationCardProps {
  prestation: Prestation;
  onClick: () => void;
}

function PrestationCard({ prestation, onClick }: PrestationCardProps): React.JSX.Element {
  return (
    <Card
      onClick={onClick}
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
      <CardContent>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Avatar>{prestation.title.charAt(0)}</Avatar>
          <div>
            <Typography color="text.primary" variant="subtitle1">
              {prestation.title}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Créé {dayjs(prestation.createdAt).fromNow()}
            </Typography>
          </div>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ marginY: 2 }}>
          {prestation.description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Client: {prestation.clientName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Adresse: {prestation.address}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Emplacement: {prestation.location}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Montant: {prestation.amount} €
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Statut:
          <Chip
            label={prestation.status}
            color={getStatusColor(prestation.status)}
            sx={{ ml: 1 }}
          />
        </Typography>
      </CardContent>
    </Card>
  );
}
