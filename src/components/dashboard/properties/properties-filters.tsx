'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useTranslation } from 'react-i18next';

import { paths } from '@/paths';
import { FilterButton, FilterPopover, useFilterContext } from '@/components/core/filter-button';
import { Option } from '@/components/core/option';

const tabs = [
  { label: 'all', value: '', count: 5 },
  { label: 'published', value: 'published', count: 3 },
  { label: 'draft', value: 'draft', count: 2 },
] as const;

export interface Filters {
  category?: string;
  sku?: string;
  status?: string;
}

export type SortDir = 'asc' | 'desc';

export interface ProductsFiltersProps {
  filters?: Filters;
  sortDir?: SortDir;
}

export function PropertiesFilters({ filters = {}, sortDir = 'desc' }: ProductsFiltersProps): React.JSX.Element {
  const { t } = useTranslation();
  const { category, sku, status } = filters;
  const router = useRouter();

  const updateSearchParams = React.useCallback(
    (newFilters: Filters, newSortDir: SortDir): void => {
      const searchParams = new URLSearchParams();

      if (newSortDir === 'asc') {
        searchParams.set('sortDir', newSortDir);
      }

      if (newFilters.status) {
        searchParams.set('status', newFilters.status);
      }

      if (newFilters.sku) {
        searchParams.set('sku', newFilters.sku);
      }

      if (newFilters.category) {
        searchParams.set('category', newFilters.category);
      }

      router.push(`${paths.dashboard.properties.list}?${searchParams.toString()}`);
    },
    [router]
  );

  const handleClearFilters = React.useCallback(() => {
    updateSearchParams({}, sortDir);
  }, [updateSearchParams, sortDir]);

  const handleStatusChange = React.useCallback(
    (_: React.SyntheticEvent, value: string) => {
      updateSearchParams({ ...filters, status: value }, sortDir);
    },
    [updateSearchParams, filters, sortDir]
  );

  const handleCategoryChange = React.useCallback(
    (value?: string) => {
      updateSearchParams({ ...filters, category: value }, sortDir);
    },
    [updateSearchParams, filters, sortDir]
  );

  const handleSkuChange = React.useCallback(
    (value?: string) => {
      updateSearchParams({ ...filters, sku: value }, sortDir);
    },
    [updateSearchParams, filters, sortDir]
  );

  const handleSortChange = React.useCallback(
    (event: SelectChangeEvent) => {
      updateSearchParams(filters, event.target.value as SortDir);
    },
    [updateSearchParams, filters]
  );

  const hasFilters = status || category || sku;

  return (
    <div>
      <Tabs onChange={handleStatusChange} sx={{ px: 3 }} value={status ?? ''} variant="scrollable">
        {tabs.map((tab) => (
          <Tab
            icon={<Chip label={tab.count} size="small" variant="soft" />}
            iconPosition="end"
            key={tab.value}
            label={t(tab.label)}
            sx={{ minHeight: 'auto' }}
            tabIndex={0}
            value={tab.value}
          />
        ))}
      </Tabs>
      <Divider />
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap', p: 2 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flex: '1 1 auto', flexWrap: 'wrap' }}>
          <FilterButton
            displayValue={category || undefined}
            label={t('category')}
            onFilterApply={(value) => {
              handleCategoryChange(value as string);
            }}
            onFilterDelete={() => {
              handleCategoryChange();
            }}
            popover={<CategoryFilterPopover />}
            value={category || undefined}
          />
          <FilterButton
            displayValue={sku || undefined}
            label={t('sku')}
            onFilterApply={(value) => {
              handleSkuChange(value as string);
            }}
            onFilterDelete={() => {
              handleSkuChange();
            }}
            popover={<SkuFilterPopover />}
            value={sku || undefined}
          />
          {hasFilters ? <Button onClick={handleClearFilters}>{t('clearFilters')}</Button> : null}
        </Stack>
        <Select name="sort" onChange={handleSortChange} sx={{ maxWidth: '100%', width: '120px' }} value={sortDir}>
          <Option value="desc">{t('newest')}</Option>
          <Option value="asc">{t('oldest')}</Option>
        </Select>
      </Stack>
    </div>
  );
}

function CategoryFilterPopover(): React.JSX.Element {
  const { t } = useTranslation();
  const { anchorEl, onApply, onClose, open, value: initialValue } = useFilterContext();
  const [value, setValue] = React.useState<string>('');

  React.useEffect(() => {
    setValue((initialValue as string | undefined) ?? '');
  }, [initialValue]);

  return (
    <FilterPopover anchorEl={anchorEl} onClose={onClose} open={open} title={t('filterByCategory')}>
      <FormControl>
        <Select
          onChange={(event) => {
            setValue(event.target.value);
          }}
          value={value}
        >
          <Option value="">{t('selectCategory')}</Option>
          <Option value="Healthcare">{t('healthcare')}</Option>
          <Option value="Makeup">{t('makeup')}</Option>
          <Option value="Skincare">{t('skincare')}</Option>
        </Select>
      </FormControl>
      <Button
        onClick={() => {
          onApply(value);
        }}
        variant="contained"
      >
        {t('apply')}
      </Button>
    </FilterPopover>
  );
}

function SkuFilterPopover(): React.JSX.Element {
  const { t } = useTranslation();
  const { anchorEl, onApply, onClose, open, value: initialValue } = useFilterContext();
  const [value, setValue] = React.useState<string>('');

  React.useEffect(() => {
    setValue((initialValue as string | undefined) ?? '');
  }, [initialValue]);

  return (
    <FilterPopover anchorEl={anchorEl} onClose={onClose} open={open} title={t('filterBySku')}>
      <FormControl>
        <OutlinedInput
          onChange={(event) => {
            setValue(event.target.value);
          }}
          onKeyUp={(event) => {
            if (event.key === 'Enter') {
              onApply(value);
            }
          }}
          value={value}
        />
      </FormControl>
      <Button
        onClick={() => {
          onApply(value);
        }}
        variant="contained"
      >
        {t('apply')}
      </Button>
    </FilterPopover>
  );
}
