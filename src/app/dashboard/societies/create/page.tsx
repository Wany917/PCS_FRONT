'use client'
import * as React from 'react';
import type { Metadata } from 'next';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';

import { config } from '@/config';
import { paths } from '@/paths';
import { SocietyCreateForm } from '@/components/dashboard/society/society-create-form';
import { useTranslation } from 'react-i18next';

//export const metadata = { title: `Create | Societies | Dashboard | ${config.site.name}` } satisfies Metadata;

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
              href={paths.dashboard.societies.list}
              sx={{ alignItems: 'center', display: 'inline-flex', gap: 1 }}
              variant="subtitle2"
            >
              <ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />
              {t('societies')}
            </Link>
          </div>
          <div>
            <Typography variant="h4">{t('createSociety')}</Typography>
          </div>
        </Stack>
        <SocietyCreateForm />
      </Stack>
    </Box>
  );
}
