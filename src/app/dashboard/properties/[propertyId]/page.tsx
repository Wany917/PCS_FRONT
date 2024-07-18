'use client';

import * as React from 'react';
// import type { Metadata } from 'next';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useGetProperty } from '@/api/properties';
import { PropertyEditForm } from '@/components/dashboard/properties/property-edit-form';
// import { config } from '@/config';
import { paths } from '@/paths';

// export const metadata = { title: `Details | Products | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const { property, isLoading } = useGetProperty(Number(id));

  if (isLoading) {
    return <div>{t('loading')}</div>;
  }

  if (!property) {
    return <div>{t('propertyNotFound')}</div>;
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
        <Stack spacing={3}>
          <div>
            <Link
              color="text.primary"
              component={RouterLink}
              href={paths.dashboard.properties.list}
              sx={{ alignItems: 'center', display: 'inline-flex', gap: 1 }}
              variant="subtitle2"
            >
              <ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />
              {t('products')}
            </Link>
          </div>
          <div>
            <Typography variant="h4">{t('editProduct')}</Typography>
          </div>
        </Stack>
        <PropertyEditForm property={property} />
      </Stack>
    </Box>
  );
}
