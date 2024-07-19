'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';

import { paths } from '@/paths';
import { useGetPropertyBookings, useDeletePropertyBooking } from '@/api/booking';
import { useTranslation } from 'react-i18next';

export default function Page({ searchParams }: { searchParams: any }): React.JSX.Element {
  const { t } = useTranslation();
  const { bookings, bookingsLoading, bookingsError, mutate } = useGetPropertyBookings(searchParams.propertyId);
  const deleteBookingMutation = useDeletePropertyBooking(searchParams.propertyId);

  const handleDeleteBooking = async (bookingId: number) => {
    try {
      await deleteBookingMutation(bookingId);
      mutate();
    } catch (error) {
      console.error('Failed to delete booking:', error);
    }
  };

  if (bookingsLoading) {
    return <div>Loading...</div>;
  }

  if (bookingsError) {
    return <div>Error loading bookings.</div>;
  }

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
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">{t('bookings')}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              component={RouterLink} 
              href={paths.dashboard.bookings.create} 
              startIcon={<PlusIcon />} 
              variant="contained"
            >
              {t('addBooking')}
            </Button>
          </Box>
        </Stack>
        <Card>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('id')}</TableCell>
                <TableCell>{t('propertyName')}</TableCell>
                <TableCell>{t('startDate')}</TableCell>
                <TableCell>{t('endDate')}</TableCell>
                <TableCell>{t('guests')}</TableCell>
                <TableCell>{t('totalPrice')}</TableCell>
                <TableCell>{t('actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.id}</TableCell>
                  <TableCell>{booking.propertyName}</TableCell>
                  <TableCell>{new Date(booking.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(booking.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>{booking.guests}</TableCell>
                  <TableCell>${booking.totalPrice}</TableCell>
                  <TableCell>
                    <IconButton 
                      component={RouterLink} 
                      href={paths.dashboard.bookings.edit(booking.id)}
                    >
                      <PencilSimpleIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteBooking(booking.id)}>
                      <TrashIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Stack>
    </Box>
  );
}