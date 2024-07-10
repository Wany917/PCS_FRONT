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
import { PropertyModal } from '@/components/dashboard/properties/property-modal';
import type { Filters } from '@/components/dashboard/properties/properties-filters';
import { PropertiesFilters } from '@/components/dashboard/properties/properties-filters';
import { PropertiesPagination } from '@/components/dashboard/properties/properties-pagination';
import { PropertiesTable } from '@/components/dashboard/properties/properties-table';
import { useGetProperties, PropertyFilters } from '@/api/properties';
import { useTranslation } from 'react-i18next';

interface PageProps {
  searchParams: PropertyFilters;
}

export default function Page({ searchParams }: PageProps): React.JSX.Element {
  const { t } = useTranslation();
  const { category, previewId, sortDir, sku, status } = searchParams;

  const { properties, propertiesLoading, propertiesError } = useGetProperties(searchParams);

  if (propertiesLoading) {
    return <div>Loading...</div>;
  }

  if (propertiesError) {
    return <div>Error loading properties.</div>;
  }

  const orderedProperties = applySort(properties, sortDir);
  const filteredProperties = applyFilters(orderedProperties, { category, sku, status });

  return (
    <React.Fragment>
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
              <Typography variant="h4">{t('properties')}</Typography>
            </Box>
            <div>
              <Button
                component={RouterLink}
                href={paths.dashboard.properties.create}
                startIcon={<PlusIcon />}
                variant="contained"
              >
                {t('add')}
              </Button>
            </div>
          </Stack>
          <Card>
            <PropertiesFilters filters={{ category, sku, status }} sortDir={sortDir} />
            <Divider />
            <Box sx={{ overflowX: 'auto' }}>
              <PropertiesTable rows={filteredProperties} />
            </Box>
            <Divider />
            <PropertiesPagination count={filteredProperties.length} page={0} />
          </Card>
        </Stack>
      </Box>
      <PropertyModal open={Boolean(previewId)} />
    </React.Fragment>
  );
}

function applySort(row: any[], sortDir: 'asc' | 'desc' | undefined): any[] {
  return row.sort((a, b) => {
    if (sortDir === 'asc') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

function applyFilters(row: any[], { category, status, sku }: Filters): any[] {
  return row.filter((item) => {
    if (category && item.category !== category) {
      return false;
    }
    if (status && item.status !== status) {
      return false;
    }
    if (sku && !item.sku?.toLowerCase().includes(sku.toLowerCase())) {
      return false;
    }
    return true;
  });
}
