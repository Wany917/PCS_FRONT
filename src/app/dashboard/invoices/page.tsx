'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import RouterLink from 'next/link';

import { paths } from '@/paths';
import { useTranslation } from 'react-i18next';
import { useGetInvoices } from '@/api/invoices';
import { InvoicesTable } from '@/components/dashboard/invoice/invoices-table';
import { InvoicesFiltersCard } from '@/components/dashboard/invoice/invoices-filters-card';
import { InvoicesFiltersButton } from '@/components/dashboard/invoice/invoices-filters-button';
import { InvoicesSort } from '@/components/dashboard/invoice/invoices-sort';
import { InvoicesPagination } from '@/components/dashboard/invoice/invoices-pagination';

export default function InvoicesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const filters = {
    customer: searchParams.get('customer') || undefined,
    endDate: searchParams.get('endDate') || undefined,
    id: searchParams.get('id') || undefined,
    startDate: searchParams.get('startDate') || undefined,
    status: searchParams.get('status') || undefined,
  };

  const sortDir = (searchParams.get('sortDir') as 'asc' | 'desc') || 'desc';
  const view = (searchParams.get('view') as 'group' | 'list') || 'group';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const { invoices, isLoading, error, totalCount } = useGetInvoices(filters, sortDir, page, limit);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

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
            <Typography variant="h4">{t('invoices')}</Typography>
          </Box>
          <div>
            <Button component={RouterLink} href={paths.dashboard.invoices.create} startIcon={<PlusIcon />} variant="contained">
              {t('new')}
            </Button>
          </div>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
          <InvoicesFiltersButton filters={filters} sortDir={sortDir} view={view} />
          <InvoicesSort filters={filters} sortDir={sortDir} view={view} />
        </Stack>
        <Stack direction="row" spacing={4} sx={{ alignItems: 'flex-start' }}>
          <InvoicesFiltersCard filters={filters} sortDir={sortDir} view={view} />
          <Stack spacing={4} sx={{ flex: '1 1 auto', minWidth: 0 }}>
            <InvoicesTable rows={invoices} view={view} />
            <InvoicesPagination count={totalCount} limit={limit} page={page} />
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}