'use client';

import * as React from 'react';
import type { Metadata } from 'next';
import RouterLink from 'next/link';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { CaretDown as CaretDownIcon } from '@phosphor-icons/react/dist/ssr/CaretDown';
import { CheckCircle as CheckCircleIcon } from '@phosphor-icons/react/dist/ssr/CheckCircle';
import { Clock as ClockIcon } from '@phosphor-icons/react/dist/ssr/Clock';
import { Minus as MinusIcon } from '@phosphor-icons/react/dist/ssr/Minus';
import { CreditCard as CreditCardIcon } from '@phosphor-icons/react/dist/ssr/CreditCard';
import { House as HouseIcon } from '@phosphor-icons/react/dist/ssr/House';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { ShieldWarning as ShieldWarningIcon } from '@phosphor-icons/react/dist/ssr/ShieldWarning';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { paths } from '@/paths';
import { dayjs } from '@/lib/dayjs';
import { PropertyItem } from '@/components/core/property-item';
import { PropertyList } from '@/components/core/property-list';
import { Notifications } from '@/components/dashboard/customer/notifications';
import Payments, { Payment }from '@/components/dashboard/customer/payments';
import type { Address } from '@/components/dashboard/customer/shipping-address';
import { ShippingAddress } from '@/components/dashboard/customer/shipping-address';
import { useParams, useRouter } from 'next/navigation';
import axios, { endpoints } from '@/lib/axios';
import {
  Autocomplete,
  CardActions,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  TextField,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { logger } from '@/lib/default-logger';
import { toast } from '@/components/core/toaster';
import { mutate } from 'swr';
import { useGetSociety } from '@/api/societies';
import { Customer } from '@/types/customer';
import { useGetUsers } from '@/api/users';

// export const metadata = { title: `Details | Customers | Dashboard | ${config.site.name}` } satisfies Metadata;

const customerSchema = zod.object({
  name: zod.string().min(1, 'Name is required').max(255),
  siren: zod.string().min(1, 'Siren is required').max(9),
  userId: zod.number().int().positive(),
});

type CustomerValues = zod.infer<typeof customerSchema>;

const addressSchema = zod.object({
  line1: zod.string().min(1, 'Line 1 is required').max(255),
  line2: zod.string().optional(),
  zipCode: zod.string().min(1, 'Zip Code is required').max(20),
  city: zod.string().min(1, 'City is required').max(100),
  state: zod.string().optional(),
  country: zod.string().min(1, 'Country is required').max(100),
});

type AddressValues = zod.infer<typeof addressSchema>;

export default function Page(): React.JSX.Element {
  const router = useRouter();

  const { societyId } = useParams();
  const { society, societyLoading } = useGetSociety(societyId as unknown as number);
  const { users, usersLoading } = useGetUsers();

  const [isEditingCustomer, setIsEditingCustomer] = React.useState(false);
  const [isEditingCustomerAddress, setIsEditingCustomerAddress] = React.useState(false);

  const {
    control: controlCustomer,
    handleSubmit: handleSubmitCustomer,
    formState: { errors: errorsCustomer },
    reset: resetCustomer,
  } = useForm<CustomerValues>({ resolver: zodResolver(customerSchema) });

  const {
    control: controlAddress,
    handleSubmit: handleSubmitAddress,
    formState: { errors: errorsAddress },
    reset: resetAddress,
  } = useForm<AddressValues>({ resolver: zodResolver(addressSchema) });

  React.useEffect(() => {
    if (!societyLoading && society) {
      resetCustomer({
        name: society.name || '',
        siren: society.siren || '',
        userId: society.userId || null,
      });

      resetAddress({
        line1: society.line1 || '',
        line2: society.line2 || '',
        zipCode: society.zipCode || '',
        city: society.city || '',
        state: society.state || '',
        country: society.country || '',
      });
    }
  }, [society, societyLoading, resetCustomer]);

  const mapping: { [key: string]: { label: string; icon: JSX.Element } } = {
    active: {
      label: 'active',
      icon: <CheckCircleIcon color="var(--mui-palette-success-main)" weight="fill" />,
    },
    blocked: { label: 'blocked', icon: <MinusIcon color="var(--mui-palette-error-main)" /> },
    pending: {
      label: 'pending',
      icon: <ClockIcon color="var(--mui-palette-warning-main)" weight="fill" />,
    },
  };

  const { label, icon } = mapping[society.status] ?? { label: 'Unknown', icon: null };

  const onSubmit = React.useCallback(
    async (values: CustomerValues | AddressValues): Promise<void> => {
      try {
        const response = await axios.put(endpoints.societies.put(society.id), values);

        if (response.data && response.data.message) {
          mutate(endpoints.societies.get(society.id));
          setIsEditingCustomer(false);
          setIsEditingCustomerAddress(false);
          toast.success('Society edited successfully!');
        }
      } catch (err) {
        logger.error(err);
        toast.error('Something went wrong!');
      }
    },
    [router, society]
  );

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
              Societies
            </Link>
          </div>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            sx={{ alignItems: 'flex-start' }}
          >
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flex: '1 1 auto' }}>
              <Avatar
                src={society.avatar ? endpoints.users.avatar.get(society.avatar) : undefined}
                sx={{ '--Avatar-size': '64px' }}
              />
              <div>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                  <Typography variant="h4">{society.name}</Typography>
                  <Chip icon={icon} label={label} size="small" variant="outlined" />
                </Stack>
                <Typography color="text.secondary" variant="body1">
                  {society.siren}
                </Typography>
              </div>
            </Stack>
          </Stack>
        </Stack>
        <Grid container spacing={4}>
          <Grid lg={4} xs={12}>
            <Stack spacing={4}>
              <form onSubmit={handleSubmitCustomer(onSubmit)}>
                <Card>
                  <CardHeader
                    action={
                      !isEditingCustomer && (
                        <IconButton onClick={() => setIsEditingCustomer(true)}>
                          <PencilSimpleIcon />
                        </IconButton>
                      )
                    }
                    avatar={
                      <Avatar>
                        <UserIcon fontSize="var(--Icon-fontSize)" />
                      </Avatar>
                    }
                    title="Basic details"
                  />
                  <PropertyList
                    divider={<Divider />}
                    orientation="vertical"
                    sx={{ '--PropertyItem-padding': '12px 24px' }}
                  >
                    <PropertyItem
                      key="Society ID"
                      name="Society ID"
                      value={<Chip label={society.id} size="small" variant="soft" />}
                    />
                    <PropertyItem
                      key="name"
                      name={!isEditingCustomer ? "Name" : undefined}
                      value={
                        isEditingCustomer ? (
                          <Controller
                            control={controlCustomer}
                            name="name"
                            render={({ field }) => (
                              <FormControl error={Boolean(errorsCustomer.name)} fullWidth>
                                <InputLabel required>{'Name'}</InputLabel>
                                <OutlinedInput {...field} />
                                {errorsCustomer.name ? (
                                  <FormHelperText>{errorsCustomer.name?.message}</FormHelperText>
                                ) : null}
                              </FormControl>
                            )}
                          />
                        ) : (
                          society.name
                        )
                      }
                    />
                    <PropertyItem
                      key="siren"
                      name={!isEditingCustomer ? "Siren" : undefined}
                      value={
                        isEditingCustomer ? (
                          <Controller
                            control={controlCustomer}
                            name="siren"
                            render={({ field }) => (
                              <FormControl error={Boolean(errorsCustomer.siren)} fullWidth>
                                <InputLabel required>{'Siren'}</InputLabel>
                                <OutlinedInput {...field} />
                                {errorsCustomer.siren ? (
                                  <FormHelperText>{errorsCustomer.siren?.message}</FormHelperText>
                                ) : null}
                              </FormControl>
                            )}
                          />
                        ) : (
                          society.siren
                        )
                      }
                    />
                    <PropertyItem
                      key="owner"
                      name={!isEditingCustomer ? "Owner" : undefined}
                      value={
                        isEditingCustomer ? (
                          <Controller
                            control={controlCustomer}
                            name="userId"
                            render={({ field }) => (
                              <Autocomplete
                                {...field}
                                options={users}
                                getOptionLabel={(option: Customer) =>
                                  option.firstname && option.lastname
                                    ? `${option.firstname} ${option.lastname}`
                                    : ''
                                }
                                isOptionEqualToValue={(option: Customer, value: Customer) =>
                                  option.id === value.id
                                }
                                defaultValue={users.find((user: Customer) => user.id === society.userId)}
                                value={users.find((user: Customer) => user.id === field.value) || null}
                                onChange={(_, newValue) => field.onChange(newValue?.id)}
                                loading={usersLoading}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Owner"
                                    error={field.value === null}
                                    helperText={field.value === null ? 'Owner is required.' : null}
                                  />
                                )}
                              />
                            )}
                          />
                        ) : (
                          users.find((user: Customer) => user.id === society.userId)?.firstname +
                          ' ' +
                          users.find((user: Customer) => user.id === society.userId)?.lastname
                        )
                      }
                    />
                  </PropertyList>
                  {isEditingCustomer && (
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                      <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="flex-end"
                        sx={{ padding: 2 }}
                      >
                        <Button type="submit" variant="contained" color="primary">
                          Save
                        </Button>
                        <Button
                          onClick={() => {
                            setIsEditingCustomer(false);
                            resetCustomer();
                          }}
                          color="secondary"
                        >
                          Cancel
                        </Button>
                      </Stack>
                    </CardActions>
                  )}
                </Card>
              </form>
              <form onSubmit={handleSubmitAddress(onSubmit)}>
                <Card>
                  <CardHeader
                    action={
                      !isEditingCustomerAddress && (
                        <IconButton onClick={() => setIsEditingCustomerAddress(true)}>
                          <PencilSimpleIcon />
                        </IconButton>
                      )
                    }
                    avatar={
                      <Avatar>
                        <HouseIcon fontSize="var(--Icon-fontSize)" />
                      </Avatar>
                    }
                    title="Shipping address"
                  />
                  {isEditingCustomerAddress ? (
                    <PropertyList
                      divider={<Divider />}
                      orientation="vertical"
                      sx={{ '--PropertyItem-padding': '12px 24px' }}
                    >
                      {[
                        {
                          key: 'line1',
                          field: 'line1',
                          error: errorsAddress.line1,
                        },
                        {
                          key: 'zipCode',
                          field: 'zipCode',
                          error: errorsAddress.zipCode,
                        },
                        {
                          key: 'city',
                          field: 'city',
                          error: errorsAddress.city,
                        },
                        {
                          key: 'state',
                          field: 'state',
                          error: errorsAddress.state,
                        },
                        {
                          key: 'country',
                          field: 'country',
                          error: errorsAddress.country,
                        },
                      ].map(({ key, field, error }) => (
                        <PropertyItem
                          key={key}
                          value={
                            <Controller
                              control={controlAddress}
                              name={
                                field as
                                  | 'line1'
                                  | 'line2'
                                  | 'zipCode'
                                  | 'city'
                                  | 'state'
                                  | 'country'
                              }
                              render={({ field }) => (
                                <FormControl error={Boolean(error)} fullWidth>
                                  <InputLabel required>{key}</InputLabel>
                                  <OutlinedInput {...field} />
                                  {errorsAddress ? (
                                    <FormHelperText>{error?.message}</FormHelperText>
                                  ) : null}
                                </FormControl>
                              )}
                            />
                          }
                        />
                      ))}
                    </PropertyList>
                  ) : (
                    <CardContent>
                      <Grid md={12} xs={12}>
                        {society.line1 ? (
                          <ShippingAddress
                            address={{
                              line1: society.line1,
                              line2: society?.line2,
                              zipCode: society.zipCode,
                              city: society.city,
                              state: society?.state,
                              country: society.country,
                            }}
                          />
                        ) : (
                          'For your security please add an address, thank you for your comprehension !'
                        )}
                      </Grid>
                    </CardContent>
                  )}
                  {isEditingCustomerAddress && (
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                      <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="flex-end"
                        sx={{ padding: 2 }}
                      >
                        <Button type="submit" variant="contained" color="primary">
                          Save
                        </Button>
                        <Button
                          onClick={() => {
                            setIsEditingCustomerAddress(false);
                            resetAddress();
                          }}
                          color="secondary"
                        >
                          Cancel
                        </Button>
                      </Stack>
                    </CardActions>
                  )}
                </Card>
              </form>
              <Card>
                <CardHeader
                  avatar={
                    <Avatar>
                      <ShieldWarningIcon fontSize="var(--Icon-fontSize)" />
                    </Avatar>
                  }
                  title="Security"
                />
                <CardContent>
                  <Stack spacing={1}>
                    <div>
                      <Button color="error" variant="contained">
                        Delete account
                      </Button>
                    </div>
                    <Typography color="text.secondary" variant="body2">
                      A deleted customer cannot be restored. All data will be permanently removed.
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
          <Grid lg={8} xs={12}>
            <Stack spacing={4}>
              <Payments
                ordersValue={2069.48}
                payments={[
                  {
                    currency: 'USD',
                    amount: 500,
                    invoiceId: 'INV-005',
                    status: 'completed',
                    createdAt: dayjs().subtract(5, 'minute').subtract(1, 'hour').toDate(),
                  },
                  {
                    currency: 'USD',
                    amount: 324.5,
                    invoiceId: 'INV-004',
                    status: 'refunded',
                    createdAt: dayjs().subtract(21, 'minute').subtract(2, 'hour').toDate(),
                  },
                  {
                    currency: 'USD',
                    amount: 746.5,
                    invoiceId: 'INV-003',
                    status: 'completed',
                    createdAt: dayjs().subtract(7, 'minute').subtract(3, 'hour').toDate(),
                  },
                  {
                    currency: 'USD',
                    amount: 56.89,
                    invoiceId: 'INV-002',
                    status: 'completed',
                    createdAt: dayjs().subtract(48, 'minute').subtract(4, 'hour').toDate(),
                  },
                  {
                    currency: 'USD',
                    amount: 541.59,
                    invoiceId: 'INV-001',
                    status: 'completed',
                    createdAt: dayjs().subtract(31, 'minute').subtract(5, 'hour').toDate(),
                  },
                ]}
                refundsValue={324.5}
                totalOrders={5}
              />
              <Card>
                <CardHeader
                  action={
                    <Button color="secondary" startIcon={<PencilSimpleIcon />}>
                      Edit
                    </Button>
                  }
                  avatar={
                    <Avatar>
                      <CreditCardIcon fontSize="var(--Icon-fontSize)" />
                    </Avatar>
                  }
                  title="Billing details"
                />
                <CardContent>
                  <Card sx={{ borderRadius: 1 }} variant="outlined">
                    <PropertyList divider={<Divider />} sx={{ '--PropertyItem-padding': '16px' }}>
                      {(
                        [
                          { key: 'Credit card', value: '**** 4142' },
                          { key: 'Country', value: 'United States' },
                          { key: 'State', value: 'Michigan' },
                          { key: 'City', value: 'Southfield' },
                          { key: 'Address', value: '1721 Bartlett Avenue, 48034' },
                          { key: 'Tax ID', value: 'EU87956621' },
                        ] satisfies { key: string; value: React.ReactNode }[]
                      ).map(
                        (item): React.JSX.Element => (
                          <PropertyItem key={item.key} name={item.key} value={item.value} />
                        )
                      )}
                    </PropertyList>
                  </Card>
                </CardContent>
              </Card>
              <Notifications
                notifications={[
                  {
                    id: 'EV-002',
                    type: 'Refund request approved',
                    status: 'pending',
                    createdAt: dayjs()
                      .subtract(34, 'minute')
                      .subtract(5, 'hour')
                      .subtract(3, 'day')
                      .toDate(),
                  },
                  {
                    id: 'EV-001',
                    type: 'Order confirmation',
                    status: 'delivered',
                    createdAt: dayjs()
                      .subtract(49, 'minute')
                      .subtract(11, 'hour')
                      .subtract(4, 'day')
                      .toDate(),
                  },
                ]}
              />
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}
