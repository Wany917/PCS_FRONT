'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { paths } from '@/paths';
import { useGetFacilities } from '@/api/facilities';
import { FacilitiesTable } from '@/components/dashboard/facilities/facilities-table';
import { FacilitiesFilters } from '@/components/dashboard/facilities/facilities-filters';

export default function FacilitiesPage(): React.JSX.Element {
  const { t } = useTranslation();
  const { facilities, isLoading } = useGetFacilities();

  if (isLoading) {
    return <Typography>Loading...</Typography>;
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
            <Typography variant="h4">{t('facilities')}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              component={RouterLink}
              href={paths.dashboard.facilities.create}
              startIcon={<PlusIcon />}
              variant="contained"
            >
              {t('addFacility')}
            </Button>
          </Box>
        </Stack>
        <Card>
          <FacilitiesFilters />
          <Divider />
          <Box sx={{ overflowX: 'auto' }}>
            <FacilitiesTable rows={facilities} />
          </Box>
        </Card>
      </Stack>
    </Box>
  );
}
