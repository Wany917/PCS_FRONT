'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CheckCircle as CheckCircleIcon } from '@phosphor-icons/react/dist/ssr/CheckCircle';
import { Clock as ClockIcon } from '@phosphor-icons/react/dist/ssr/Clock';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { Image as ImageIcon } from '@phosphor-icons/react/dist/ssr/Image';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';

import { paths } from '@/paths';
import type { ColumnDef } from '@/components/core/data-table';
import { DataTable } from '@/components/core/data-table';
import { useTranslation } from 'react-i18next';

export interface Property {
  id: number;
  title: string;
  image: string | null;
  category: string;
  type: string;
  beds: number;
  currency?: string;
  price: string;
  status: 'published' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertiesTableProps {
  rows?: Property[];
  onDelete: (id: number) => void;
}

export function PropertiesTable({ rows = [], onDelete }: PropertiesTableProps): React.JSX.Element {
  const { t } = useTranslation();

  const columns: ColumnDef<Property>[] = [
    {
      formatter: (row): React.JSX.Element => (
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          {row.image ? (
            <Box
              sx={{
                alignItems: 'center',
                bgcolor: 'var(--mui-palette-background-level2)',
                backgroundImage: `url(${row.image})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                borderRadius: 1,
                display: 'flex',
                height: '80px',
                justifyContent: 'center',
                overflow: 'hidden',
                width: '80px',
              }}
            />
          ) : (
            <Box
              sx={{
                alignItems: 'center',
                bgcolor: 'var(--mui-palette-background-level2)',
                borderRadius: 1,
                display: 'flex',
                height: '80px',
                justifyContent: 'center',
                width: '80px',
              }}
            >
              <ImageIcon fontSize="var(--icon-fontSize-lg)" />
            </Box>
          )}
          <div>
            <Link
              color="text.primary"
              component={RouterLink}
              href={paths.dashboard.properties.preview(row.id)}
              sx={{ whiteSpace: 'nowrap' }}
              variant="subtitle2"
            >
              {row.title}
            </Link>
            <Typography color="text.secondary" variant="body2">
              {t('in')} {row.category}
            </Typography>
          </div>
        </Stack>
      ),
      name: t('name'),
      width: '300px',
    },
    { field: 'beds', name: t('beds'), width: '100px' },
    {
      formatter(row) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: row.currency || 'USD' }).format(parseFloat(row.price));
      },
      name: t('price'),
      width: '150px',
    },
    {
      formatter: (row) => new Date(row.createdAt).toLocaleDateString(),
      name: t('createdAt'),
      width: '150px',
    },
    {
      formatter: (row) => new Date(row.updatedAt).toLocaleDateString(),
      name: t('updatedAt'),
      width: '150px',
    },
    {
      formatter: (row): React.JSX.Element => {
        const mapping = {
          draft: { label: t('draft'), icon: <ClockIcon color="var(--mui-palette-secondary-main)" /> },
          published: {
            label: t('published'),
            icon: <CheckCircleIcon color="var(--mui-palette-success-main)" weight="fill" />,
          },
        } as const;
        const { label, icon } = mapping[row.status] ?? { label: t('unknown'), icon: null };

        return <Chip icon={icon} label={label} size="small" variant="outlined" />;
      },
      name: t('status'),
      width: '150px',
    },
    {
      formatter: (row): React.JSX.Element => (
        <Stack direction="row" spacing={1}>
          <IconButton component={RouterLink} href={paths.dashboard.properties.preview(row.id)}>
            <EyeIcon />
          </IconButton>
          <IconButton onClick={() => { onDelete(row.id); }}>
            <TrashIcon />
          </IconButton>
        </Stack>
      ),
      name: t('actions'),
      hideName: true,
      width: '100px',
      align: 'right',
    },
  ];

  return (
    <React.Fragment>
      <DataTable<Property> columns={columns} rows={rows} />
      {!rows.length ? (
        <Box sx={{ p: 3 }}>
          <Typography color="text.secondary" sx={{ textAlign: 'center' }} variant="body2">
            {t('noPropertiesFound')}
          </Typography>
        </Box>
      ) : null}
    </React.Fragment>
  );
}
