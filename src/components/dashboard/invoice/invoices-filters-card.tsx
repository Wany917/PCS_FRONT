'use client'
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { InvoicesFilters } from './invoices-filters';
import type { Filters } from './invoices-filters';
import { useTranslation } from 'react-i18next';

interface InvoicesFiltersCardProps {
  filters?: Filters;
  sortDir?: 'asc' | 'desc';
  view?: 'group' | 'list';
}

export function InvoicesFiltersCard({ filters, sortDir, view }: InvoicesFiltersCardProps): React.JSX.Element {
  const { t } = useTranslation();
  return (
    <Card
      sx={{ display: { xs: 'none', lg: 'block' }, flex: '0 0 auto', width: '340px', position: 'sticky', top: '80px' }}
    >
      <CardContent>
        <Stack spacing={3}>
          <Typography variant="h5">{t('filters')}</Typography>
          <InvoicesFilters filters={filters} sortDir={sortDir} view={view} />
        </Stack>
      </CardContent>
    </Card>
  );
}
