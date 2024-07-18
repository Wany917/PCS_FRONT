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
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { CheckCircle as CheckCircleIcon } from '@phosphor-icons/react/dist/ssr/CheckCircle';
import { Clock as ClockIcon } from '@phosphor-icons/react/dist/ssr/Clock';
import { Minus as MinusIcon } from '@phosphor-icons/react/dist/ssr/Minus';
import { CreditCard as CreditCardIcon } from '@phosphor-icons/react/dist/ssr/CreditCard';
import { House as HouseIcon } from '@phosphor-icons/react/dist/ssr/House';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { ShieldWarning as ShieldWarningIcon } from '@phosphor-icons/react/dist/ssr/ShieldWarning';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { paths } from '@/paths';
import { dayjs } from '@/lib/dayjs';
import { PropertyItem } from '@/components/core/property-item';
import { PropertyList } from '@/components/core/property-list';
import { Notifications } from '@/components/dashboard/customer/notifications';
import Payments, { Payment } from '@/components/dashboard/customer/payments';
import type { Address } from '@/components/dashboard/customer/shipping-address';
import { ShippingAddress } from '@/components/dashboard/customer/shipping-address';
import { useGetUser } from '@/api/users';
import { useParams, useRouter } from 'next/navigation';
import axios, { endpoints } from '@/lib/axios';
import {
  CardActions,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { logger } from '@/lib/default-logger';
import { toast } from '@/components/core/toaster';
import { mutate } from 'swr';
import { useTranslation } from 'react-i18next';

const customerSchema = zod.object({
  avatar: zod.string().optional(),
  firstname: zod.string().min(1, 'firstnameRequired').max(255),
  lastname: zod.string().min(1, 'lastnameRequired').max(255),
  email: zod.string().email('invalidEmail').min(1, 'emailRequired').max(255),
});

type CustomerValues = zod.infer<typeof customerSchema>;

const addressSchema = zod.object({
  line1: zod.string().min(1, 'line1Required').max(255),
  line2: zod.string().optional(),
  zipCode: zod.string().min(1, 'zipCodeRequired').max(20),
  city: zod.string().min(1, 'cityRequired').max(100),
  state: zod.string().optional(),
  country: zod.string().min(1, 'countryRequired').max(100)
});

type AddressValues = zod.infer<typeof addressSchema>;

export default function Page(): React.JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();
  const { customerId } = useParams();
  const { user, userLoading } = useGetUser(customerId as unknown as number);

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
    reset: resetAddress
  } = useForm<AddressValues>({ resolver: zodResolver(addressSchema) });

  React.useEffect(() => {
    if (!userLoading && user) {
      resetCustomer({
        avatar: user.avatar || '',
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      });

      resetAddress({
        line1: user.line1 || '',
        line2: user.line2 || '',
        zipCode: user.zipCode || '',
        city: user.city || '',
        state: user.state || '',
        country: user.country || '',
      });
    }
  }, [user, userLoading, resetCustomer, resetAddress]);

  const mapping: Record<string, { label: string; icon: JSX.Element }> = {
    active: {
      label: t('active'),
      icon: <CheckCircleIcon color="var(--mui-palette-success-main)" weight="fill" />,
    },
    blocked: { label: t('blocked'), icon: <MinusIcon color="var(--mui-palette-error-main)" /> },
    pending: {
      label: t('pending'),
      icon: <ClockIcon color="var(--mui-palette-warning-main)" weight="fill" />,
    },
  };

  const { label, icon } = mapping[user?.status] ?? { label: t('unknown'), icon: null };

  const onSubmit = React.useCallback(
    async (values: CustomerValues | AddressValues): Promise<void> => {
      try {
        const response = await axios.put(endpoints.users.put(user.id), values);

        if (response.data?.message) {
          mutate(endpoints.users.get(user.id));
          setIsEditingCustomer(false);
          setIsEditingCustomerAddress(false);
          toast.success(t('customerEditedSuccessfully'));
        }
      } catch (err) {
        logger.error(err);
        toast.error(t('somethingWentWrong'));
      }
    },
    [router, user, t]
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
              href={paths.dashboard.customers.list}
              sx={{ alignItems: 'center', display: 'inline-flex', gap: 1 }}
              variant="subtitle2"
            >
              <ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />
              {t('customers')}
            </Link>
          </div>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            sx={{ alignItems: 'flex-start' }}
          >
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flex: '1 1 auto' }}>
              <Avatar
                src={user?.avatar ? endpoints.users.avatar.get(user.avatar) : undefined}
                sx={{ '--Avatar-size': '64px' }}
              />
              <div>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                  <Typography variant="h4">
                    {user?.firstname} {user?.lastname}
                  </Typography>
                  <Chip icon={icon} label={label} size="small" variant="outlined" />
                </Stack>
                <Typography color="text.secondary" variant="body1">
                  {user?.email}
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
                        <IconButton onClick={() => { setIsEditingCustomer(true); }}>
                          <PencilSimpleIcon />
                        </IconButton>
                      )
                    }
                    avatar={
                      <Avatar>
                        <UserIcon fontSize="var(--Icon-fontSize)" />
                      </Avatar>
                    }
                    title={t('basicDetails')}
                  />
                  <PropertyList
                    divider={<Divider />}
                    orientation="vertical"
                    sx={{ '--PropertyItem-padding': '12px 24px' }}
                  >
                    <PropertyItem
                      key="Customer ID"
                      name={t('customerId')}
                      value={<Chip label={user?.id} size="small" variant="soft" />}
                    />
                    {[
                      {
                        key: t('firstname'),
                        value: user?.firstname,
                        field: 'firstname',
                        error: errorsCustomer.firstname,
                      },
                      {
                        key: t('lastname'),
                        value: user?.lastname,
                        field: 'lastname',
                        error: errorsCustomer.lastname,
                      },
                      {
                        key: t('email'),
                        value: user?.email,
                        field: 'email',
                        error: errorsCustomer.email,
                      },
                    ].map(({ key, value, field, error }) => (
                      <PropertyItem
                        key={key}
                        name={!isEditingCustomer ? key : undefined}
                        value={
                          isEditingCustomer ? (
                            <Controller
                              control={controlCustomer}
                              name={field as 'firstname' | 'lastname' | 'email'}
                              render={({ field }) => (
                                <FormControl error={Boolean(error)} fullWidth>
                                  <InputLabel required>{key}</InputLabel>
                                  <OutlinedInput {...field} />
                                  {errorsCustomer ? <FormHelperText>{error?.message}</FormHelperText> : null}
                                </FormControl>
                              )}
                            />
                          ) : (
                            value
                          )
                        }
                      />
                    ))}
                  </PropertyList>
                  {isEditingCustomer ? <CardActions sx={{ justifyContent: 'flex-end' }}>
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={2}
                        sx={{ padding: 2 }}
                      >
                        <Button color="primary" type="submit" variant="contained">
                          {t('save')}
                        </Button>
                        <Button
                          color="secondary"
                          onClick={() => {
                            setIsEditingCustomer(false);
                            resetCustomer();
                          }}
                        >
                          {t('cancel')}
                        </Button>
                      </Stack>
                    </CardActions> : null}
                </Card>
              </form>
              <form onSubmit={handleSubmitAddress(onSubmit)}>
                <Card>
                  <CardHeader
                    action={
                      !isEditingCustomerAddress && (
                        <IconButton onClick={() => { setIsEditingCustomerAddress(true); }}>
                          <PencilSimpleIcon />
                        </IconButton>
                      )
                    }
                    avatar={
                      <Avatar>
                        <HouseIcon fontSize="var(--Icon-fontSize)" />
                      </Avatar>
                    }
                    title={t('shippingAddress')}
                  />
                  {isEditingCustomerAddress ? (
                    <PropertyList
                      divider={<Divider />}
                      orientation="vertical"
                      sx={{ '--PropertyItem-padding': '12px 24px' }}
                    >
                      {[
                        {
                          key: t('line1'),
                          field: 'line1',
                          error: errorsAddress.line1,
                        },
                        {
                          key: t('zipCode'),
                          field: 'zipCode',
                          error: errorsAddress.zipCode,
                        },
                        {
                          key: t('city'),
                          field: 'city',
                          error: errorsAddress.city,
                        },
                        {
                          key: t('state'),
                          field: 'state',
                          error: errorsAddress.state,
                        },
                        {
                          key: t('country'),
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
                                field as 'line1' | 'line2' | 'zipCode' | 'city' | 'state' | 'country'
                              }
                              render={({ field }) => (
                                <FormControl error={Boolean(error)} fullWidth>
                                  <InputLabel required>{key}</InputLabel>
                                  <OutlinedInput {...field} />
                                  {errorsAddress ? <FormHelperText>{error?.message}</FormHelperText> : null}
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
                        {user?.line1 ? (
                          <ShippingAddress
                            address={{
                              line1: user.line1,
                              line2: user?.line2,
                              zipCode: user.zipCode,
                              city: user.city,
                              state: user?.state,
                              country: user.country,
                            }}
                          />
                        ) : (
                          t('addAddressPrompt')
                        )}
                      </Grid>
                    </CardContent>
                  )}
                  {isEditingCustomerAddress ? <CardActions sx={{ justifyContent: 'flex-end' }}>
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={2}
                        sx={{ padding: 2 }}
                      >
                        <Button color="primary" type="submit" variant="contained">
                          {t('save')}
                        </Button>
                        <Button
                          color="secondary"
                          onClick={() => {
                            setIsEditingCustomerAddress(false);
                            resetAddress();
                          }}
                        >
                          {t('cancel')}
                        </Button>
                      </Stack>
                    </CardActions> : null}
                </Card>
              </form>
              <Card>
                <CardHeader
                  avatar={
                    <Avatar>
                      <ShieldWarningIcon fontSize="var(--Icon-fontSize)" />
                    </Avatar>
                  }
                  title={t('security')}
                />
                <CardContent>
                  <Stack spacing={1}>
                    <div>
                      <Button color="error" variant="contained">
                        {t('deleteAccount')}
                      </Button>
                    </div>
                    <Typography color="text.secondary" variant="body2">
                      {t('deleteAccountWarning')}
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
                    status: t('status.completed'),
                    createdAt: dayjs().subtract(5, 'minute').subtract(1, 'hour').toDate(),
                  },
                  {
                    currency: 'USD',
                    amount: 324.5,
                    invoiceId: 'INV-004',
                    status: t('status.refunded'),
                    createdAt: dayjs().subtract(21, 'minute').subtract(2, 'hour').toDate(),
                  },
                  {
                    currency: 'USD',
                    amount: 746.5,
                    invoiceId: 'INV-003',
                    status: t('status.completed'),
                    createdAt: dayjs().subtract(7, 'minute').subtract(3, 'hour').toDate(),
                  },
                  {
                    currency: 'USD',
                    amount: 56.89,
                    invoiceId: 'INV-002',
                    status: t('status.completed'),
                    createdAt: dayjs().subtract(48, 'minute').subtract(4, 'hour').toDate(),
                  },
                  {
                    currency: 'USD',
                    amount: 541.59,
                    invoiceId: 'INV-001',
                    status: t('status.completed'),
                    createdAt: dayjs().subtract(31, 'minute').subtract(5, 'hour').toDate(),
                  },
                ]}
                refundsValue={324.5}
                totalOrders={5}
              />
              <Notifications
                notifications={[
                  {
                    id: 'EV-002',
                    type: t('refundRequestApproved'),
                    status: t('status.pending'),
                    createdAt: dayjs().subtract(34, 'minute').subtract(5, 'hour').subtract(3, 'day').toDate(),
                  },
                  {
                    id: 'EV-001',
                    type: t('orderConfirmation'),
                    status: t('status.delivered'),
                    createdAt: dayjs().subtract(49, 'minute').subtract(11, 'hour').subtract(4, 'day').toDate(),
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
