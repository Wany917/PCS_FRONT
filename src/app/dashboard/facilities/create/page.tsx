'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

export default function CreateFacilityPage(): React.JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();

  const [facilityType, setFacilityType] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [provider, setProvider] = React.useState('');

  const handleFacilityChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFacilityType(event.target.value as string);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Ajoutez ici la logique pour envoyer les données de la nouvelle installation à votre API

    // Redirection après la création
    router.push('/dashboard/facilities');
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        width: 'var(--Content-width)',
      }}
    >
      <Stack spacing={4}>
        <Typography variant="h4">{t('addFacility')}</Typography>
        <Card>
          <CardContent>
            <Stack spacing={3}>
              <FormControl fullWidth>
                <InputLabel>{t('facilityType')}</InputLabel>
                <Select
                  value={facilityType}
                  onChange={handleFacilityChange}
                  label={t('facilityType')}
                >
                  <MenuItem value="cleaning">{t('Cleaning')}</MenuItem>
                  <MenuItem value="maintenance">{t('Maintenance')}</MenuItem>
                  <MenuItem value="repair">{t('Repair')}</MenuItem>
                  <MenuItem value="transport">{t('Transport')}</MenuItem>
                  {/* Ajoutez d'autres options nécessaires */}
                </Select>
              </FormControl>
              <TextField
                label={t('price')}
                fullWidth
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <TextField
                label={t('providerName')}
                fullWidth
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
              />
              <TextField
                label={t('facilityDescription')}
                fullWidth
                multiline
                rows={4}
              />
              <Button type="submit" variant="contained">
                {t('createFacility')}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
