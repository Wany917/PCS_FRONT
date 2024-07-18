'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';

import { paths } from '@/paths';
import { dayjs } from '@/lib/dayjs';
import { DynamicLogo } from '@/components/core/logo';
import { InvoicePDFLink } from '@/components/dashboard/invoice/invoice-pdf-link';
import { LineItemsTable } from '@/components/dashboard/invoice/line-items-table';
import { useGetInvoice } from '@/api/invoices'; // Assurez-vous d'avoir ce hook

export default function InvoiceDetailPage(): React.JSX.Element {
  const { invoiceId } = useParams();
  const { invoice, isLoading, error } = useGetInvoice(invoiceId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!invoice) return <div>Invoice not found</div>;

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
              href={paths.dashboard.invoices.list}
              sx={{ alignItems: 'center', display: 'inline-flex', gap: 1 }}
              variant="subtitle2"
            >
              <ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />
              Invoices
            </Link>
          </div>
          <Stack direction="row" spacing={3} sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Stack spacing={1}>
              <Typography variant="h4">{invoice.id}</Typography>
              <div>
                <Chip color="warning" label={invoice.status} variant="soft" />
              </div>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <InvoicePDFLink invoice={invoice}>
                <Button color="secondary">Download</Button>
              </InvoicePDFLink>
              <Button component="a" href={paths.pdf.invoice(invoice.id.toString())} target="_blank" variant="contained">
                Preview
              </Button>
            </Stack>
          </Stack>
        </Stack>
        <Card sx={{ p: 6 }}>
          <Stack spacing={6}>
            <Stack direction="row" spacing={3} sx={{ alignItems: 'flex-start' }}>
              <Box sx={{ flex: '1 1 auto' }}>
                <Typography variant="h4">Invoice</Typography>
              </Box>
              <Box sx={{ flex: '0 0 auto' }}>
                <DynamicLogo colorDark="light" colorLight="dark" emblem height={60} width={60} />
              </Box>
            </Stack>
            <Stack spacing={1}>
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <Box sx={{ flex: '0 1 150px' }}>
                  <Typography variant="subtitle2">Number:</Typography>
                </Box>
                <div>
                  <Typography variant="body2">{invoice.id}</Typography>
                </div>
              </Stack>
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <Box sx={{ flex: '0 1 150px' }}>
                  <Typography variant="subtitle2">Due date:</Typography>
                </Box>
                <div>
                  <Typography variant="body2">{dayjs(invoice.dueDate).format('MMM D, YYYY')}</Typography>
                </div>
              </Stack>
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <Box sx={{ flex: '0 1 150px' }}>
                  <Typography variant="subtitle2">Issue date:</Typography>
                </Box>
                <div>
                  <Typography variant="body2">{dayjs(invoice.createdAt).format('MMM D, YYYY')}</Typography>
                </div>
              </Stack>
              {invoice.issuerSociety ? <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  <Box sx={{ flex: '0 1 150px' }}>
                    <Typography variant="subtitle2">Issuer VAT No:</Typography>
                  </Box>
                  <Typography variant="body2">{invoice.issuerSociety.siren}</Typography>
                </Stack> : null}
            </Stack>
            <Grid container spacing={3}>
              <Grid md={6} xs={12}>
                <Stack spacing={1}>
                  <Typography variant="subtitle1">{invoice.issuerSociety?.name || 'Issuer Company'}</Typography>
                  <Typography variant="body2">
                    {invoice.issuerSociety?.line1}
                    <br />
                    {invoice.issuerSociety?.city}, {invoice.issuerSociety?.state}, {invoice.issuerSociety?.country}
                    <br />
                    {invoice.issuerSociety?.zipCode}
                    <br />
                    {invoice.issuerUser?.email}
                    <br />
                    {invoice.issuerUser?.phoneNumber}
                  </Typography>
                </Stack>
              </Grid>
              <Grid md={6} xs={12}>
                <Stack spacing={1}>
                  <Typography variant="subtitle1">Billed to</Typography>
                  <Typography variant="body2">
                    {invoice.user?.firstname} {invoice.user?.lastname}
                    <br />
                    {invoice.user?.line1}
                    <br />
                    {invoice.user?.city}, {invoice.user?.state}, {invoice.user?.country}
                    <br />
                    {invoice.user?.zipCode}
                    <br />
                    {invoice.user?.email}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
            <div>
              <Typography variant="h5">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(invoice.amount)} due{' '}
                {dayjs(invoice.dueDate).format('MMM D, YYYY')}
              </Typography>
            </div>
            <Stack spacing={2}>
              <Card sx={{ borderRadius: 1, overflowX: 'auto' }} variant="outlined">
                <LineItemsTable rows={invoice.items} />
              </Card>
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
                  <Box sx={{ flex: '0 1 150px' }}>
                    <Typography>Subtotal</Typography>
                  </Box>
                  <Box sx={{ flex: '0 1 100px', textAlign: 'right' }}>
                    <Typography>
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(invoice.amount)}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
                  <Box sx={{ flex: '0 1 150px' }}>
                    <Typography variant="h6">Total</Typography>
                  </Box>
                  <Box sx={{ flex: '0 1 100px', textAlign: 'right' }}>
                    <Typography variant="h6">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(invoice.amount)}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Stack>
            {invoice.notes ? <Stack spacing={1}>
                <Typography variant="h6">Notes</Typography>
                <Typography color="text.secondary" variant="body2">
                  {invoice.notes}
                </Typography>
              </Stack> : null}
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}