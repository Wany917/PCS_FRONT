'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { paths } from '@/paths';
import { PropertyEditForm } from '@/components/dashboard/properties/property-edit-form';
import { useTranslation } from 'react-i18next';
import { useGetProperty } from '@/api/properties';

export default function Page(): React.JSX.Element {
  const { t } = useTranslation();
  const params = useParams();
  const propertyId = params.propertyId ? parseInt(params.propertyId, 10) : null;

  const { property, propertyLoading, propertyError } = useGetProperty(propertyId);

  if (propertyLoading) {
    return <div>Loading...</div>;
  }

  if (propertyError) {
    return <div>Error loading property.</div>;
  }

  const propertyData = {
    id: property.id,
    title: property.title,
    propertyType: property.propertyType,
    description: property.description,
    country: property.country,
    state: property.state,
    city: property.city,
    zipCode: property.zipCode,
    line1: property.line1,
    price: parseFloat(property.price),
    images: property.propertyImages.map(img => ({ id: img.id, url: img.link, fileName: img.link })),
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    beds: property.beds,
    userId: property.userId,
    isPrivate: property.isPrivate,
  };

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
              {t('properties')}
            </Link>
          </div>
          <div>
            <Typography variant="h4">{t('editProperty')}</Typography>
          </div>
        </Stack>
        <PropertyEditForm property={propertyData} />
      </Stack>
    </Box>
  );
}
