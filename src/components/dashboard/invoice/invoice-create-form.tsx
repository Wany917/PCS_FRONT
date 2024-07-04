'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PlusCircle as PlusCircleIcon } from '@phosphor-icons/react/dist/ssr/PlusCircle';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { dayjs } from '@/lib/dayjs';
import { logger } from '@/lib/default-logger';
import { Option } from '@/components/core/option';
import { toast } from '@/components/core/toaster';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { useGetUsers } from '@/api/users';
import { Customer } from '@/types/customer';
import { useGetSocieties } from '@/api/societies';
import { Society } from '@/types/society';
import { useTranslation } from 'react-i18next';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

function calculateSubtotal(lineItems: LineItem[]): number {
  const subtotal = lineItems.reduce(
    (acc, lineItem) => acc + lineItem.quantity * lineItem.unitPrice,
    0
  );
  return parseFloat(subtotal.toFixed(2));
}

function calculateTotalWithoutTaxes(subtotal: number, discount: number): number {
  return subtotal - discount;
}

function calculateTax(totalWithoutTax: number, taxRate: number): number {
  const tax = totalWithoutTax * (taxRate / 100);
  return parseFloat(tax.toFixed(2));
}

function calculateTotal(totalWithoutTax: number, taxes: number): number {
  return totalWithoutTax + taxes;
}

const schema = zod
  .object({
    issueDate: zod.date(),
    dueDate: zod.date(),
    userId: zod.number().int().positive(),
    issuerSocietyId: zod.number().int().positive(),
    lineItems: zod.array(
      zod.object({
        id: zod.string(),
        description: zod.string().min(1, { message: 'Description is required' }).max(255),
        quantity: zod.number().min(1, { message: 'Quantity must be greater than or equal to 1' }),
        unitPrice: zod.number().min(0, { message: 'Unit price must be greater than or equal to 0' }),
      })
    ),
    discount: zod
      .number()
      .min(0, { message: 'Discount must be greater than or equal to 0' })
      .max(100, { message: 'Discount must be less than or equal to 100' }),
    taxRate: zod
      .number()
      .min(0, { message: 'Tax rate must be greater than or equal to 0' })
      .max(100, { message: 'Tax rate must be less than or equal to 100' }),
  })
  .refine((data) => data.issueDate < data.dueDate, {
    message: 'Due date should be greater than issue date',
    path: ['dueDate'],
  });

type Values = zod.infer<typeof schema>;

const defaultValues = {
  issueDate: new Date(),
  dueDate: dayjs().add(1, 'month').toDate(),
  userId: 1,
  issuerSocietyId: 1,
  lineItems: [{ id: 'LI-001', description: '', quantity: 1, unitPrice: 0 }],
  discount: 0,
  taxRate: 0,
} satisfies Values;

export function InvoiceCreateForm(): React.JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      try {
        console.log(values);
        // Make API request
        toast.success(t('invoiceCreated'));
        router.push(paths.dashboard.invoices.list);
      } catch (err) {
        logger.error(err);
        toast.error(t('somethingWentWrong'));
      }
    },
    [router, t]
  );

  const handleAddLineItem = React.useCallback(() => {
    const lineItems = getValues('lineItems');

    setValue('lineItems', [
      ...lineItems,
      { id: `LI-${lineItems.length + 1}`, description: '', quantity: 1, unitPrice: 0 },
    ]);
  }, [getValues, setValue]);

  const handleRemoveLineItem = React.useCallback(
    (lineItemId: string) => {
      const lineItems = getValues('lineItems');

      setValue(
        'lineItems',
        lineItems.filter((lineItem) => lineItem.id !== lineItemId)
      );
    },
    [getValues, setValue]
  );

  const lineItems = watch('lineItems');
  const discount = watch('discount');
  const taxRate = watch('taxRate');

  const subtotal = calculateSubtotal(lineItems);
  const totalWithoutTaxes = calculateTotalWithoutTaxes(subtotal, discount);
  const tax = calculateTax(totalWithoutTaxes, taxRate);
  const total = calculateTotal(totalWithoutTaxes, tax);

  const { users, usersLoading } = useGetUsers();
  const { societies, societiesLoading } = useGetSocieties();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent>
          <Stack divider={<Divider />} spacing={4}>
            <Stack spacing={3}>
              <Typography variant="h6">{t('basicInformation')}</Typography>
              <Grid container spacing={3}>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
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
                        value={users.find((user: Customer) => user.id === field.value) || null}
                        onChange={(_, newValue) => field.onChange(newValue?.id)}
                        loading={usersLoading}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={t('customer')}
                            error={field.value === null}
                            helperText={field.value === null ? t('customerRequired') : null}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="issuerSocietyId"
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={societies}
                        getOptionLabel={(option: Society) => (option.name ? option.name : '')}
                        isOptionEqualToValue={(option: Society, value: Society) =>
                          option.id === value.id
                        }
                        value={societies.find((society: Society) => society.id === field.value) || null}
                        onChange={(_, newValue) => field.onChange(newValue?.id)}
                        loading={societiesLoading}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={t('society')}
                            error={field.value === null}
                            helperText={field.value === null ? t('societyRequired') : null}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="issueDate"
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        format="MMM D, YYYY"
                        label={t('issueDate')}
                        onChange={(date) => {
                          field.onChange(date?.toDate());
                        }}
                        slotProps={{
                          textField: {
                            error: Boolean(errors.issueDate),
                            fullWidth: true,
                            helperText: errors.issueDate?.message,
                          },
                        }}
                        value={dayjs(field.value)}
                      />
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="dueDate"
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        format="MMM D, YYYY"
                        label={t('dueDate')}
                        onChange={(date) => {
                          field.onChange(date?.toDate());
                        }}
                        slotProps={{
                          textField: {
                            error: Boolean(errors.dueDate),
                            fullWidth: true,
                            helperText: errors.dueDate?.message,
                          },
                        }}
                        value={dayjs(field.value)}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Stack>
            <Stack spacing={3}>
              <Typography variant="h6">{t('lineItems')}</Typography>
              <Stack divider={<Divider />} spacing={2}>
                {lineItems.map((lineItem, index) => (
                  <Stack
                    direction="row"
                    key={lineItem.id}
                    spacing={3}
                    sx={{ alignItems: 'center', flexWrap: 'wrap' }}
                  >
                    <Controller
                      control={control}
                      name={`lineItems.${index}.description`}
                      render={({ field }) => (
                        <FormControl
                          error={Boolean(errors.lineItems?.[index]?.description)}
                          sx={{ flex: '1 1 auto', minWidth: '200px' }}
                        >
                          <InputLabel>{t('description')}</InputLabel>
                          <OutlinedInput {...field} />
                          {errors.lineItems?.[index]?.description ? (
                            <FormHelperText>
                              {errors.lineItems[index]!.description!.message}
                            </FormHelperText>
                          ) : null}
                        </FormControl>
                      )}
                    />
                    <Controller
                      control={control}
                      name={`lineItems.${index}.quantity`}
                      render={({ field }) => (
                        <FormControl
                          error={Boolean(errors.lineItems?.[index]?.quantity)}
                          sx={{ width: '140px' }}
                        >
                          <InputLabel>{t('quantity')}</InputLabel>
                          <OutlinedInput
                            {...field}
                            inputProps={{ step: 1 }}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              const value = event.target.valueAsNumber;

                              if (isNaN(value)) {
                                field.onChange('');
                                return;
                              }

                              if (value > 100) {
                                return;
                              }

                              field.onChange(parseInt(event.target.value));
                            }}
                            type="number"
                          />
                          {errors.lineItems?.[index]?.quantity ? (
                            <FormHelperText>
                              {errors.lineItems[index]!.quantity!.message}
                            </FormHelperText>
                          ) : null}
                        </FormControl>
                      )}
                    />
                    <Controller
                      control={control}
                      name={`lineItems.${index}.unitPrice`}
                      render={({ field }) => (
                        <FormControl
                          error={Boolean(errors.lineItems?.[index]?.unitPrice)}
                          sx={{ width: '140px' }}
                        >
                          <InputLabel>{t('unitPrice')}</InputLabel>
                          <OutlinedInput
                            {...field}
                            inputProps={{ step: 0.01 }}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              const value = event.target.valueAsNumber;

                              if (isNaN(value)) {
                                field.onChange('');
                                return;
                              }

                              field.onChange(parseFloat(value.toFixed(2)));
                            }}
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                            type="number"
                          />
                          {errors.lineItems?.[index]?.unitPrice ? (
                            <FormHelperText>
                              {errors.lineItems[index]!.unitPrice!.message}
                            </FormHelperText>
                          ) : null}
                        </FormControl>
                      )}
                    />
                    <IconButton
                      onClick={() => {
                        handleRemoveLineItem(lineItem.id);
                      }}
                      sx={{ alignSelf: 'flex-end' }}
                    >
                      <TrashIcon />
                    </IconButton>
                  </Stack>
                ))}
                <div>
                  <Button
                    color="secondary"
                    onClick={handleAddLineItem}
                    startIcon={<PlusCircleIcon />}
                    variant="outlined"
                  >
                    {t('addItem')}
                  </Button>
                </div>
              </Stack>
            </Stack>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Grid container spacing={3}>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="discount"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.discount)} fullWidth>
                        <InputLabel>{t('discount')}</InputLabel>
                        <OutlinedInput
                          {...field}
                          inputProps={{ step: 0.01 }}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const value = event.target.valueAsNumber;

                            if (isNaN(value)) {
                              field.onChange('');
                              return;
                            }

                            field.onChange(parseFloat(value.toFixed(2)));
                          }}
                          startAdornment={<InputAdornment position="start">$</InputAdornment>}
                          type="number"
                        />
                        {errors.discount ? (
                          <FormHelperText>{errors.discount.message}</FormHelperText>
                        ) : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="taxRate"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.taxRate)} fullWidth>
                        <InputLabel>{t('taxRate')}</InputLabel>
                        <OutlinedInput
                          {...field}
                          inputProps={{ step: 0.01 }}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const value = event.target.valueAsNumber;

                            if (isNaN(value)) {
                              field.onChange('');
                              return;
                            }

                            if (value > 100) {
                              field.onChange(100);
                              return;
                            }

                            field.onChange(parseFloat(value.toFixed(2)));
                          }}
                          type="number"
                        />
                        {errors.taxRate ? (
                          <FormHelperText>{errors.taxRate.message}</FormHelperText>
                        ) : null}
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Stack spacing={2} sx={{ width: '300px', maxWidth: '100%' }}>
                <Stack direction="row" spacing={3} sx={{ justifyContent: 'space-between' }}>
                  <Typography variant="body2">{t('subtotal')}</Typography>
                  <Typography variant="body2">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                      subtotal
                    )}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={3} sx={{ justifyContent: 'space-between' }}>
                  <Typography variant="body2">{t('discount')}</Typography>
                  <Typography variant="body2">
                    {discount
                      ? new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(discount)
                      : '-'}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={3} sx={{ justifyContent: 'space-between' }}>
                  <Typography variant="body2">{t('taxes')}</Typography>
                  <Typography variant="body2">
                    {tax
                      ? new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(tax)
                      : '-'}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={3} sx={{ justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1">{t('subtotal')}</Typography>
                  <Typography variant="subtitle1">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                      total
                    )}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button color="secondary">{t('cancel')}</Button>
          <Button type="submit" variant="contained">
            {t('createInvoice')}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
