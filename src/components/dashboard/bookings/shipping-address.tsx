import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';

export interface Address {
  country: string;
  state?: string;
  city: string;
  zipCode: string;
  line1: string;
  line2?: string;
}

export interface ShippingAddressProps {
  address: Address;
}

export function ShippingAddress({ address }: ShippingAddressProps): React.ReactElement {
  return (
    <Card sx={{ borderRadius: 1, height: '100%' }} variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Typography>
            {address.line1},
            <br />
            {address.line2 ? (address.line2, <br />) : null}
            {address.zipCode} {address.city},
            <br />
            {address.state ? (address.state, <br />): null} {address.country}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
