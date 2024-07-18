'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import { CustomersPagination } from '@/components/dashboard/customer/customers-pagination';
import { CustomersSelectionProvider } from '@/components/dashboard/customer/customers-selection-context';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import { useGetUsers } from '@/api/users';
import { paths } from '@/paths';
import { useTranslation } from 'react-i18next';

export default function Page({ searchParams }: { searchParams: any }): React.JSX.Element {
  const { t } = useTranslation();
  const { users } = useGetUsers();

  const filteredCustomers = applyFilters(users, searchParams);
  const tabs = [
    { label: t('all'), value: '', count: users.length },
    { label: t('active'), value: 'active', count: applyFilters(users, { status: 'active' }).length },
    { label: t('pending'), value: 'pending', count: applyFilters(users, { status: 'pending' }).length },
    { label: t('blocked'), value: 'blocked', count: applyFilters(users, { status: 'blocked' }).length },
  ];

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
            <Button component={RouterLink} href={paths.dashboard.bookings.create} startIcon={<PlusIcon />} variant="contained">
              {t('addBooking')}
            </Button>
          </Box>
        </Stack>
        <CustomersSelectionProvider customers={filteredCustomers}>
          <Card>
            <CustomersFilters filters={searchParams} tabs={tabs} />
            <Divider />
            <Box sx={{ overflowX: 'auto' }}>
              <CustomersTable rows={filteredCustomers} />
            </Box>
            <Divider />
            <CustomersPagination count={filteredCustomers.length} page={0} />
          </Card>
        </CustomersSelectionProvider>
      </Stack>
    </Box>
  );
}


// Sorting and filtering has to be done on the server.

function applySort(row: Customer[], sortDir: 'asc' | 'desc' | undefined): Customer[] {
  return row.sort((a, b) => {
    if (sortDir === 'asc') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

function applyFilters(row: Customer[], { email, status }: Filters): Customer[] {
  return row.filter((item) => {
    if (email) {
      if (!item.email?.toLowerCase().includes(email.toLowerCase())) {
        return false;
      }
    }

    if (status) {
      if (item.status !== status) {
        return false;
      }
    }

    return true;
  });
}
