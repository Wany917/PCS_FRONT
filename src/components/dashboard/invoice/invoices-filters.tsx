'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { dayjs } from '@/lib/dayjs';
import { Option } from '@/components/core/option';
import { useTranslation } from 'react-i18next';

export interface Filters {
  customer?: string;
  endDate?: string;
  id?: string;
  startDate?: string;
  status?: string;
}

export type SortDir = 'asc' | 'desc';

const schema = zod
  .object({
    customer: zod.string().optional(),
    endDate: zod.date().max(new Date('2099-01-01')).nullable().optional(),
    id: zod.string().optional(),
    startDate: zod.date().max(new Date('2099-01-01')).nullable().optional(),
    status: zod.string().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
      }

      return true;
    },
    { message: 'End date should be greater than start date', path: ['endDate'] }
  );

type Values = zod.infer<typeof schema>;

function getDefaultValues(filters: Filters): Values {
  return {
    customer: filters.customer ?? '',
    endDate: filters.endDate ? dayjs(filters.endDate).toDate() : null,
    id: filters.id ?? '',
    status: filters.status ?? '',
    startDate: filters.startDate ? dayjs(filters.startDate).toDate() : null,
  };
}

export interface InvoicesFiltersProps {
  filters?: Filters;
  onFiltersApplied?: () => void;
  onFiltersCleared?: () => void;
  sortDir?: SortDir;
  view?: 'group' | 'list';
}

export function InvoicesFilters({
  filters = {},
  onFiltersApplied,
  onFiltersCleared,
  sortDir = 'desc',
  view,
}: InvoicesFiltersProps): React.JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<Values>({ values: getDefaultValues(filters), resolver: zodResolver(schema) });

  const updateSearchParams = React.useCallback(
    (newFilters: Filters) => {
      const searchParams = new URLSearchParams();

      // Keep view and sortDir as search params

      if (view) {
        searchParams.set('view', view);
      }

      if (sortDir === 'asc') {
        searchParams.set('sortDir', sortDir);
      }

      if (newFilters.status) {
        searchParams.set('status', newFilters.status);
      }

      if (newFilters.id) {
        searchParams.set('id', newFilters.id);
      }

      if (newFilters.customer) {
        searchParams.set('customer', newFilters.customer);
      }

      if (newFilters.startDate) {
        searchParams.set('startDate', newFilters.startDate);
      }

      if (newFilters.endDate) {
        searchParams.set('endDate', newFilters.endDate);
      }

      router.push(`${paths.dashboard.invoices.list}?${searchParams.toString()}`);
    },
    [router, sortDir, view]
  );

  const handleApplyFilters = React.useCallback(
    (values: Values): void => {
      updateSearchParams({
        ...values,
        startDate: values.startDate ? dayjs(values.startDate).format('YYYY-MM-DD') : undefined,
        endDate: values.endDate ? dayjs(values.endDate).format('YYYY-MM-DD') : undefined,
      });
      onFiltersApplied?.();
    },
    [updateSearchParams, onFiltersApplied]
  );

  const handleClearFilters = React.useCallback(() => {
    updateSearchParams({});
    onFiltersCleared?.();
  }, [updateSearchParams, onFiltersCleared]);

  const hasFilters = filters.id || filters.customer || filters.status || filters.startDate || filters.endDate;

  return (
    <form onSubmit={handleSubmit(handleApplyFilters)}>
      <Stack spacing={3}>
        <Controller
          control={control}
          name="id"
          render={({ field }) => (
            <FormControl error={Boolean(errors.id)}>
              <InputLabel>{t('invoiceId')}</InputLabel>
              <OutlinedInput {...field} />
            </FormControl>
          )}
        />
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <FormControl error={Boolean(errors.status)} fullWidth>
              <InputLabel>{t('status.status')}</InputLabel>
              <Select {...field}>
                <Option value="">{t('all')}</Option>
                <Option value="pending">{t('status.pending')}</Option>
                <Option value="paid">{t('status.paid')}</Option>
                <Option value="canceled">{t('status.canceled')}</Option>
              </Select>
            </FormControl>
          )}
        />
        <Controller
          control={control}
          name="customer"
          render={({ field }) => (
            <FormControl error={Boolean(errors.customer)}>
              <InputLabel>{t('customer')}</InputLabel>
              <OutlinedInput {...field} />
            </FormControl>
          )}
        />
        <Controller
          control={control}
          name="startDate"
          render={({ field }) => (
            <DatePicker
              format="MMM D, YYYY"
              label={t('from')}
              onChange={(date) => {
                field.onChange(date ? date.toDate() : null);
              }}
              slotProps={{ textField: { error: Boolean(errors.startDate), helperText: errors.startDate?.message } }}
              value={field.value ? dayjs(field.value) : null}
            />
          )}
        />
        <Controller
          control={control}
          name="endDate"
          render={({ field }) => (
            <DatePicker
              format="MMM D, YYYY"
              label={t('to')}
              onChange={(date) => {
                field.onChange(date ? date.toDate() : null);
              }}
              slotProps={{ textField: { error: Boolean(errors.endDate), helperText: errors.endDate?.message } }}
              value={field.value ? dayjs(field.value) : null}
            />
          )}
        />
        <Button disabled={!isDirty} type="submit" variant="contained">
          {t('apply')}
        </Button>
        {hasFilters ? (
          <Button color="secondary" onClick={handleClearFilters}>
            {t('clearFilters')}
          </Button>
        ) : null}
      </Stack>
    </form>
  );
}
