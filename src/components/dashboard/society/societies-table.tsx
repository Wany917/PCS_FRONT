'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CheckCircle as CheckCircleIcon } from '@phosphor-icons/react/dist/ssr/CheckCircle';
import { Clock as ClockIcon } from '@phosphor-icons/react/dist/ssr/Clock';
import { Minus as MinusIcon } from '@phosphor-icons/react/dist/ssr/Minus';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';

import { paths } from '@/paths';
import { dayjs } from '@/lib/dayjs';
import { DataTable } from '@/components/core/data-table';
import type { ColumnDef } from '@/components/core/data-table';

import { useSocietiesSelection } from './societies-selection-context';
import { endpoints } from '@/lib/axios';

export interface Society {
  id: string;
  avatar?: string;
  name: string;
  siren: number;
  userId: string;
  status: 'pending' | 'active' | 'blocked';
  createdAt: Date;
  updatedAt: Date;
}

const columns = [
  {
    formatter: (row): React.JSX.Element => (
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Avatar src={row.avatar ? endpoints.users.avatar.get(row.avatar) : undefined} />{' '}
        <div>
          <Link
            color="inherit"
            component={RouterLink}
            href={paths.dashboard.societies.details(row.id)}
            sx={{ whiteSpace: 'nowrap' }}
            variant="subtitle2"
          >
            {row.name}
          </Link>
          <Typography color="text.secondary" variant="body2">
            {row.siren}
          </Typography>
        </div>
      </Stack>
    ),
    name: 'Name',
    width: '250px',
  },
  {
    formatter(row) {
      return dayjs(row.createdAt).format('MMM D, YYYY h:mm A');
    },
    name: 'Created at',
    width: '200px',
  },
  {
    formatter(row) {
      return dayjs(row.updatedAt).format('MMM D, YYYY h:mm A');
    },
    name: 'Updated at',
    width: '200px',
  },
  {
    formatter: (row): React.JSX.Element => {
      const mapping = {
        active: { label: 'Active', icon: <CheckCircleIcon color="var(--mui-palette-success-main)" weight="fill" /> },
        blocked: { label: 'Blocked', icon: <MinusIcon color="var(--mui-palette-error-main)" /> },
        pending: { label: 'Pending', icon: <ClockIcon color="var(--mui-palette-warning-main)" weight="fill" /> },
      } as const;
      const { label, icon } = mapping[row.status] ?? { label: 'Unknown', icon: null };

      return <Chip icon={icon} label={label} size="small" variant="outlined" />;
    },
    name: 'Status',
    width: '150px',
  },
  {
    formatter: (row): React.JSX.Element => (
      <IconButton component={RouterLink} href={paths.dashboard.societies.details(row.id)}>
        <PencilSimpleIcon />
      </IconButton>
    ),
    name: 'Actions',
    hideName: true,
    width: '100px',
    align: 'right',
  },
] satisfies ColumnDef<Society>[];

export interface SocietiesTableProps {
  rows: Society[];
}

export function SocietiesTable({ rows }: SocietiesTableProps): React.JSX.Element {
  const { deselectAll, deselectOne, selectAll, selectOne, selected } = useSocietiesSelection();

  return (
    <React.Fragment>
      <DataTable<Society>
        columns={columns}
        onDeselectAll={deselectAll}
        onDeselectOne={(_, row) => {
          deselectOne(row.id);
        }}
        onSelectAll={selectAll}
        onSelectOne={(_, row) => {
          selectOne(row.id);
        }}
        rows={rows}
        selectable
        selected={selected}
      />
      {!rows.length ? (
        <Box sx={{ p: 3 }}>
          <Typography color="text.secondary" sx={{ textAlign: 'center' }} variant="body2">
            No societies found
          </Typography>
        </Box>
      ) : null}
    </React.Fragment>
  );
}
