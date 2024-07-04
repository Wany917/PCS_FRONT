'use client'

import * as React from 'react';
import RouterLink from 'next/link';
import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { paths } from '@/paths';
import { config } from '@/config';
import { dayjs } from '@/lib/dayjs';
import { SocietiesFilters } from '@/components/dashboard/society/societies-filters';
import type { Filters } from '@/components/dashboard/society/societies-filters';
import { SocietiesPagination } from '@/components/dashboard/society/societies-pagination';
import { SocietiesSelectionProvider } from '@/components/dashboard/society/societies-selection-context';
import { SocietiesTable } from '@/components/dashboard/society/societies-table';
import type { Society } from '@/components/dashboard/society/societies-table';
import { useGetSocieties } from '@/api/societies';
import { useTranslation } from 'react-i18next'; // Add this line

//export const metadata = { title: `List | Societies | Dashboard | ${config.site.name}` } satisfies Metadata;

interface PageProps {
  searchParams: { name?: string; userId?: string; sortDir?: 'asc' | 'desc'; status?: string };
}

export default function Page({ searchParams }: PageProps): React.JSX.Element {
  const { t } = useTranslation(); // Add this line
  const { name, sortDir, status } = searchParams;
  const { societies } = useGetSocieties();

  const sortedSocieties = applySort(societies, sortDir);
  const filteredSocieties = applyFilters(sortedSocieties, { name, status });

  const tabs = [
    { label: t('all'), value: '', count: societies.length },
    { label: t('active'), value: 'active', count: applyFilters(societies, { status: 'active' }).length },
    { label: t('pending'), value: 'pending', count: applyFilters(societies, { status: 'pending' }).length },
    { label: t('blocked'), value: 'blocked', count: applyFilters(societies, { status: 'blocked' }).length },
  ] as const;

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
            <Typography variant="h4">{t('societies')}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button component={RouterLink} href={paths.dashboard.societies.create} startIcon={<PlusIcon />} variant="contained">
              {t('add')}
            </Button>
          </Box>
        </Stack>
        <SocietiesSelectionProvider societies={filteredSocieties}>
          <Card>
            <SocietiesFilters filters={{ name, status }} sortDir={sortDir} tabs={tabs} />
            <Divider />
            <Box sx={{ overflowX: 'auto' }}>
              <SocietiesTable rows={filteredSocieties} />
            </Box>
            <Divider />
            <SocietiesPagination count={filteredSocieties.length} page={0} />
          </Card>
        </SocietiesSelectionProvider>
      </Stack>
    </Box>
  );
}

// Sorting and filtering has to be done on the server.

function applySort(row: Society[], sortDir: 'asc' | 'desc' | undefined): Society[] {
  return row.sort((a, b) => {
    if (sortDir === 'asc') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

function applyFilters(row: Society[], { name, status }: Filters): Society[] {
  return row.filter((item) => {
    if (name) {
      if (!item.name?.toLowerCase().includes(name.toLowerCase())) {
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
