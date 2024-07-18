'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { CheckCircle as CheckCircleIcon } from '@phosphor-icons/react/dist/ssr/CheckCircle';
import { Clock as ClockIcon } from '@phosphor-icons/react/dist/ssr/Clock';
import { XCircle as XCircleIcon } from '@phosphor-icons/react/dist/ssr/XCircle';

import { paths } from '@/paths';
import { dayjs } from '@/lib/dayjs';
import type { ColumnDef } from '@/components/core/data-table';
import { DataTable } from '@/components/core/data-table';
import { useTranslation } from 'react-i18next';

export interface Invoice {
  id: number;
  amount: number;
  dueDate: string;
  paidAt: string | null;
  items: any[];
  userId: number | null;
  user: {
    id: number;
    firstname: string;
    lastname: string;
    avatar?: string;
    email: string;
  } | null;
  issuerUserId: number | null;
  issuerUser: {
    id: number;
    firstname: string;
    lastname: string;
    avatar?: string;
    email: string;
  } | null;
  issuerSocietyId: number | null;
  issuerSociety: {
    id: number;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'pending';

interface GroupedRows {
  draft: Invoice[];
  sent: Invoice[];
  paid: Invoice[];
  pending: Invoice[];
}

function groupRows(invoices: Invoice[]): GroupedRows {
  return invoices.reduce<GroupedRows>(
    (acc, invoice) => {
      const status: InvoiceStatus = invoice.paidAt ? 'paid' : 
        (dayjs(invoice.dueDate).isAfter(dayjs()) ? 'pending' : 'draft');
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(invoice);
      return acc;
    },
    { draft: [], sent: [], paid: [], pending: [] }
  );
}

export interface InvoicesTableProps {
  rows: Invoice[];
  view?: 'group' | 'list';
}

export function InvoicesTable({ rows = [], view = 'group' }: InvoicesTableProps): React.JSX.Element {
  const { t } = useTranslation();

  const columns: ColumnDef<Invoice>[] = [
    {
      formatter: (row): React.JSX.Element => (
        <Stack
          component={RouterLink}
          direction="row"
          href={paths.dashboard.invoices.details(row.id.toString())}
          spacing={2}
          sx={{ alignItems: 'center', display: 'inline-flex', textDecoration: 'none', whiteSpace: 'nowrap' }}
        >
          <Avatar src={row.user?.avatar} />
          <div>
            <Typography color="text.primary" variant="subtitle2">
              {row.id}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {row.user ? `${row.user.firstname} ${row.user.lastname}` : row.issuerSociety?.name || 'N/A'}
            </Typography>
          </div>
        </Stack>
      ),
      name: t('customer'),
      width: '250px',
    },
    {
      formatter: (row): React.JSX.Element => (
        <Typography variant="subtitle2">
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.amount)}
        </Typography>
      ),
      name: t('amount'),
      width: '150px',
    },
    {
      formatter: (row): React.JSX.Element => (
        <div>
          <Typography variant="subtitle2">{t('issued')}</Typography>
          <Typography color="text.secondary" variant="body2">
            {dayjs(row.createdAt).format('MMM D, YYYY')}
          </Typography>
        </div>
      ),
      name: t('issueDate'),
      width: '150px',
    },
    {
      formatter: (row): React.JSX.Element => (
        <div>
          <Typography variant="subtitle2">{t('due')}</Typography>
          <Typography color="text.secondary" variant="body2">
            {row.dueDate ? dayjs(row.dueDate).format('MMM D, YYYY') : 'N/A'}
          </Typography>
        </div>
      ),
      name: t('dueDate'),
      width: '150px',
    },
    {
      formatter: (row): React.JSX.Element => {
        const status: InvoiceStatus = row.paidAt ? 'paid' : 
          (dayjs(row.dueDate).isAfter(dayjs()) ? 'pending' : 'draft');
        const mapping: Record<InvoiceStatus, { label: string; icon: React.ReactNode }> = {
          draft: { label: t('status.draft'), icon: <ClockIcon color="var(--mui-palette-info-main)" weight="fill" /> },
          sent: { label: t('status.sent'), icon: <ClockIcon color="var(--mui-palette-warning-main)" weight="fill" /> },
          paid: { label: t('status.paid'), icon: <CheckCircleIcon color="var(--mui-palette-success-main)" weight="fill" /> },
          pending: { label: t('status.pending'), icon: <XCircleIcon color="var(--mui-palette-error-main)" weight="fill" /> },
        };
        const { label, icon } = mapping[status];

        return <Chip icon={icon} label={label} size="small" variant="outlined" />;
      },
      name: t('status'),
      width: '150px',
    },
    {
      formatter: (row): React.JSX.Element => (
        <IconButton component={RouterLink} href={paths.dashboard.invoices.details(row.id.toString())}>
          <ArrowRightIcon />
        </IconButton>
      ),
      name: t('actions'),
      width: '100px',
      align: 'right',
    },
  ];

  const totalAmount = rows.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidAmount = rows.filter(invoice => invoice.paidAt).reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingAmount = totalAmount - paidAmount;

  if (view === 'group') {
    const groups = groupRows(rows);

    return (
      <>
        <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
          <Card sx={{ p: 2, flexGrow: 1 }}>
            <Typography variant="h6">{t('total')}</Typography>
            <Typography variant="h4">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalAmount)}</Typography>
          </Card>
          <Card sx={{ p: 2, flexGrow: 1 }}>
            <Typography variant="h6">{t('paid')}</Typography>
            <Typography variant="h4">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(paidAmount)}</Typography>
          </Card>
          <Card sx={{ p: 2, flexGrow: 1 }}>
            <Typography variant="h6">{t('pending')}</Typography>
            <Typography variant="h4">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(pendingAmount)}</Typography>
          </Card>
        </Stack>
        <Stack spacing={6}>
          {(Object.keys(groups) as InvoiceStatus[]).map((key) => {
            const group = groups[key];

            return (
              <Stack key={key} spacing={2}>
                <Typography color="text.secondary" variant="h6">
                  {t(`groupTitles.${key}`)} ({group.length})
                </Typography>
                {group.length > 0 ? (
                  <Card sx={{ overflowX: 'auto' }}>
                    <DataTable<Invoice> columns={columns} hideHead rows={group} />
                  </Card>
                ) : (
                  <Typography color="text.secondary" variant="body2">
                    {t('noInvoicesFound')}
                  </Typography>
                )}
              </Stack>
            );
          })}
        </Stack>
      </>
    );
  }

  return (
    <Card sx={{ overflowX: 'auto' }}>
      <DataTable<Invoice> columns={columns} hideHead rows={rows} />
      {rows.length === 0 && (
        <Box sx={{ p: 3 }}>
          <Typography color="text.secondary" sx={{ textAlign: 'center' }} variant="body2">
            {t('noInvoicesFound')}
          </Typography>
        </Box>
      )}
    </Card>
  );
}