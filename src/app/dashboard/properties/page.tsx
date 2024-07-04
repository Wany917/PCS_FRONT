'use client';
import * as React from 'react';
import type { Metadata } from 'next';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { config } from '@/config';
import { paths } from '@/paths';
import { dayjs } from '@/lib/dayjs';
import { PropertyModal } from '@/components/dashboard/properties/property-modal';
import type { Filters } from '@/components/dashboard/properties/properties-filters';
import { PropertiesFilters } from '@/components/dashboard/properties/properties-filters';
import { PropertiesPagination } from '@/components/dashboard/properties/properties-pagination';
import { PropertiesTable } from '@/components/dashboard/properties/properties-table';
import type { Product } from '@/components/dashboard/properties/properties-table';
import { useTranslation } from 'react-i18next';

const products = [
  {
    id: 'PRD-005',
    name: 'Soja & Co. Eucalyptus',
    image: '/assets/product-5.png',
    category: 'Skincare',
    type: 'physical',
    quantity: 10,
    currency: 'USD',
    price: 65.99,
    sku: '592_LDKDI',
    status: 'draft',
    createdAt: dayjs().subtract(23, 'minute').toDate(),
  },
  {
    id: 'PRD-004',
    name: 'Necessaire Body Lotion',
    image: '/assets/product-4.png',
    category: 'Skincare',
    type: 'physical',
    quantity: 5,
    currency: 'USD',
    price: 17.99,
    sku: '321_UWEAJT',
    status: 'published',
    createdAt: dayjs().subtract(5, 'minute').subtract(1, 'hour').toDate(),
  },
  {
    id: 'PRD-003',
    name: 'Ritual of Sakura',
    image: '/assets/product-3.png',
    category: 'Skincare',
    type: 'physical',
    quantity: 8,
    currency: 'USD',
    price: 155,
    sku: '211_QFEXJO',
    status: 'draft',
    createdAt: dayjs().subtract(43, 'minute').subtract(3, 'hour').toDate(),
  },
  {
    id: 'PRD-002',
    name: 'Lancome Rouge',
    image: '/assets/product-2.png',
    category: 'Makeup',
    type: 'physical',
    quantity: 0,
    currency: 'USD',
    price: 95,
    sku: '978_UBFGJC',
    status: 'published',
    createdAt: dayjs().subtract(15, 'minute').subtract(4, 'hour').toDate(),
  },
  {
    id: 'PRD-001',
    name: 'Erbology Aloe Vera',
    image: '/assets/product-1.png',
    category: 'Healthcare',
    type: 'physical',
    quantity: 10,
    currency: 'USD',
    price: 24,
    sku: '401_1BBXBK',
    status: 'published',
    createdAt: dayjs().subtract(39, 'minute').subtract(7, 'hour').toDate(),
  },
] satisfies Product[];

interface PageProps {
  searchParams: { category?: string; previewId?: string; sortDir?: 'asc' | 'desc'; sku?: string; status?: string };
}

export default function Page({ searchParams }: PageProps): React.JSX.Element {
  const { t } = useTranslation();
  const { category, previewId, sortDir, sku, status } = searchParams;

  const orderedProducts = applySort(products, sortDir);
  const filteredProducts = applyFilters(orderedProducts, { category, sku, status });

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
              <PropertiesTable rows={filteredProducts} />
            </Box>
            <Divider />
            <PropertiesPagination count={filteredProducts.length} page={0} />
          </Card>
        </Stack>
      </Box>
      <PropertyModal open={Boolean(previewId)} />
    </React.Fragment>
  );
}

// Sorting and filtering has to be done on the server.

function applySort(row: Product[], sortDir: 'asc' | 'desc' | undefined): Product[] {
  return row.sort((a, b) => {
    if (sortDir === 'asc') {
      return a.createdAt.getTime() - b.createdAt.getTime();
    }

    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}

function applyFilters(row: Product[], { category, status, sku }: Filters): Product[] {
  return row.filter((item) => {
    if (category) {
      if (item.category !== category) {
        return false;
      }
    }

    if (status) {
      if (item.status !== status) {
        return false;
      }
    }

    if (sku) {
      if (!item.sku?.toLowerCase().includes(sku.toLowerCase())) {
        return false;
      }
    }

    return true;
  });
}
