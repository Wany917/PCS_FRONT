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

import { paths } from '@/paths';
import { OrdersFilters } from '@/components/dashboard/order/orders-filters';
import type { Filters } from '@/components/dashboard/order/orders-filters';
import { OrdersPagination } from '@/components/dashboard/order/orders-pagination';
import { OrdersSelectionProvider } from '@/components/dashboard/order/orders-selection-context';
import { OrdersTable } from '@/components/dashboard/order/orders-table';
import { useGetOrders } from '@/api/orders';
import { useTranslation } from 'react-i18next';

interface PageProps {
  searchParams: { customer?: string; id?: string; sortDir?: 'asc' | 'desc'; status?: string };
}

export default function Page({ searchParams }: PageProps): React.JSX.Element {
  const { t } = useTranslation();
  const { customer, id, sortDir, status } = searchParams;
  const { orders } = useGetOrders();

  const sortedOrders = applySort(orders, sortDir);
  const filteredOrders = applyFilters(sortedOrders, { customer, id, status });

  const tabs = [
    { label: t('all'), value: '', count: orders.length },
    { label: t('pending'), value: 'pending', count: applyFilters(orders, { status: 'pending' }).length },
    { label: t('completed'), value: 'completed', count: applyFilters(orders, { status: 'completed' }).length },
    { label: t('canceled'), value: 'canceled', count: applyFilters(orders, { status: 'canceled' }).length },
    { label: t('rejected'), value: 'rejected', count: applyFilters(orders, { status: 'rejected' }).length },
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
            <Typography variant="h4">{t('orders')}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button component={RouterLink} href={paths.dashboard.orders.create} startIcon={<PlusIcon />} variant="contained">
              {t('addOrder')}
            </Button>
          </Box>
        </Stack>
        <OrdersSelectionProvider orders={filteredOrders}>
          <Card>
            <OrdersFilters filters={{ customer, id, status }} sortDir={sortDir} tabs={tabs} />
            <Divider />
            <Box sx={{ overflowX: 'auto' }}>
              <OrdersTable rows={filteredOrders} />
            </Box>
            <Divider />
            <OrdersPagination count={filteredOrders.length} page={0} />
          </Card>
        </OrdersSelectionProvider>
      </Stack>
    </Box>
  );
}

// Sorting and filtering has to be done on the server.

function applySort(row: Order[], sortDir: 'asc' | 'desc' | undefined): Order[] {
  return row.sort((a, b) => {
    if (sortDir === 'asc') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

function applyFilters(row: Order[], { customer, id, status }: Filters): Order[] {
  return row.filter((item) => {
    if (customer) {
      if (!item.customer?.name?.toLowerCase().includes(customer.toLowerCase())) {
        return false;
      }
    }

    if (id) {
      if (!item.id?.toLowerCase().includes(id.toLowerCase())) {
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
