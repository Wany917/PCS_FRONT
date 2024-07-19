'use client';
import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { useTranslation } from 'react-i18next';

import { paths } from '@/paths';
import { useCreatePropertyBooking } from '../../../../api/booking';
import { useRouter } from 'next/navigation';

export default function Page(): React.JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();
  const createBookingMutation = useCreatePropertyBooking();

  const [bookingData, setBookingData] = React.useState({
    propertyId: '',
    startDate: '',
    endDate: '',
    guests: '',
    totalPrice: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBookingData({
      ...bookingData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await createBookingMutation(bookingData);
      router.push(paths.dashboard.bookings.list);
    } catch (error) {
      console.error('Failed to create booking:', error);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        width: 'var(--Content-width)',
      }}
    >
      <Stack spacing={4}>
        <Stack spacing={3}>
          <div>
            <Link
              color="text.primary"
              component={RouterLink}
              href={paths.dashboard.bookings.list}
              sx={{ alignItems: 'center', display: 'inline-flex', gap: 1 }}
              variant="subtitle2"
            >
              <ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />
              {t('bookings')}
            </Link>
          </div>
          <div>
            <Typography variant="h4">{t('createBooking')}</Typography>
          </div>
        </Stack>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label={t('propertyId')}
              name="propertyId"
              onChange={handleChange}
              required
              value={bookingData.propertyId}
            />
            <TextField
              fullWidth
              label={t('startDate')}
              name="startDate"
              onChange={handleChange}
              required
              type="date"
              value={bookingData.startDate}
            />
            <TextField
              fullWidth
              label={t('endDate')}
              name="endDate"
              onChange={handleChange}
              required
              type="date"
              value={bookingData.endDate}
            />
            <TextField
              fullWidth
              label={t('guests')}
              name="guests"
              onChange={handleChange}
              required
              type="number"
              value={bookingData.guests}
            />
            <TextField
              fullWidth
              label={t('totalPrice')}
              name="totalPrice"
              onChange={handleChange}
              required
              type="number"
              value={bookingData.totalPrice}
            />
            <Button type="submit" variant="contained">
              {t('createBooking')}
            </Button>
          </Stack>
        </form>
      </Stack>
    </Box>
  );
}