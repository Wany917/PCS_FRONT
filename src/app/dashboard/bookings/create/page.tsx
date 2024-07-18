'use client';
import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { useTranslation } from 'react-i18next';

import { CustomerCreateForm } from '@/components/dashboard/bookings/booking-create-form';
import { paths } from '@/paths';

export default function Page(): React.JSX.Element {
  const { t } = useTranslation();

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
          <div>
            <Typography variant="h4">{t('createBooking')}</Typography>
          </div>
        </Stack>
        <CustomerCreateForm />
      </Stack>
    </Box>
  );
}
