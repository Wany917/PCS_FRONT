'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';

import { paths } from '@/paths';
import { PropertyList } from '@/components/core/property-list';
import { PropertyItem } from '@/components/core/property-item';
import { useGetPropertyBooking, useUpdatePropertyBooking, useDeletePropertyBooking } from '@/api/booking';
import { useTranslation } from 'react-i18next';

export default function Page(): React.JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();
  const { propertyId, bookingId } = useParams();
  const { booking, bookingLoading, bookingError } = useGetPropertyBooking(Number(propertyId), Number(bookingId));
  const updateBookingMutation = useUpdatePropertyBooking(Number(propertyId), Number(bookingId));
  const deleteBookingMutation = useDeletePropertyBooking(Number(propertyId));

  const [isEditing, setIsEditing] = React.useState(false);
  const [editedBooking, setEditedBooking] = React.useState(booking);

  React.useEffect(() => {
    setEditedBooking(booking);
  }, [booking]);

  if (bookingLoading) {
    return <div>Loading...</div>;
  }

  if (bookingError) {
    return <div>Error loading booking.</div>;
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedBooking({
      ...editedBooking,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdateBooking = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await updateBookingMutation(editedBooking);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update booking:', error);
    }
  };

  const handleDeleteBooking = async () => {
    try {
      await deleteBookingMutation(Number(bookingId));
      router.push(paths.dashboard.bookings.list);
    } catch (error) {
      console.error('Failed to delete booking:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 'var(--Content-maxWidth)', m: 'var(--Content-margin)', p: 'var(--Content-padding)', width: 'var(--Content-width)' }}>
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
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            sx={{ alignItems: 'flex-start' }}
          >
            <div>
              <Typography variant="h4">
                {t('booking')} #{booking.id}
              </Typography>
            </div>
          </Stack>
        </Stack>
        <Card>
          <CardHeader
            action={
              !isEditing && (
                <IconButton onClick={() => { setIsEditing(true); }}>
                  <PencilSimpleIcon />
                </IconButton>
              )
            }
            title={t('bookingDetails')}
          />
          <Divider />
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleUpdateBooking}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label={t('propertyName')}
                    name="propertyName"
                    onChange={handleChange}
                    value={editedBooking.propertyName}
                  />
                  <TextField
                    fullWidth
                    label={t('startDate')}
                    name="startDate"
                    onChange={handleChange}
                    type="date"
                    value={editedBooking.startDate}
                  />
                  <TextField
                    fullWidth
                    label={t('endDate')}
                    name="endDate"
                    onChange={handleChange}
                    type="date"
                    value={editedBooking.endDate}
                  />
                  <TextField
                    fullWidth
                    label={t('guests')}
                    name="guests"
                    onChange={handleChange}
                    type="number"
                    value={editedBooking.guests}
                  />
                  <TextField
                    fullWidth
                    label={t('totalPrice')}
                    name="totalPrice"
                    onChange={handleChange}
                    type="number"
                    value={editedBooking.totalPrice}
                  />
                  <Button type="submit" variant="contained">
                    {t('saveChanges')}
                  </Button>
                </Stack>
              </form>
            ) : (
              <PropertyList>
                <PropertyItem label={t('propertyName')} value={booking.propertyName} />
                <PropertyItem label={t('startDate')} value={new Date(booking.startDate).toLocaleDateString()} />
                <PropertyItem label={t('endDate')} value={new Date(booking.endDate).toLocaleDateString()} />
                <PropertyItem label={t('guests')} value={booking.guests} />
                <PropertyItem label={t('totalPrice')} value={`$${booking.totalPrice}`} />
              </PropertyList>
            )}
          </CardContent>
        </Card>
        {!isEditing && (
          <Box sx={{ mt: 3 }}>
            <Button color="error" onClick={handleDeleteBooking} variant="contained">
              {t('deleteBooking')}
            </Button>
          </Box>
        )}
      </Stack>
    </Box>
  );
}