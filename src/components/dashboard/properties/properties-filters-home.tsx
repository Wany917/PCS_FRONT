'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';

import { paths } from '@/paths';
import { FilterButton, FilterPopover, useFilterContext } from '@/components/core/filter-button';
import { Option } from '@/components/core/option';

export interface Filters {
  propertyType?: string;
  priceRange?: [number, number];
}

export type SortDir = 'asc' | 'desc';

export interface PropertiesFiltersProps {
  filters?: Filters;
  sortDir?: SortDir;
}

export function PropertiesFilters({ filters = {}, sortDir = 'desc' }: PropertiesFiltersProps): React.JSX.Element {
  const { t } = useTranslation();
  const { propertyType, priceRange } = filters;
  const router = useRouter();

  const updateSearchParams = React.useCallback(
    (newFilters: Filters, newSortDir: SortDir): void => {
      const searchParams = new URLSearchParams();

      if (newSortDir === 'asc') {
        searchParams.set('sortDir', newSortDir);
      }

      if (newFilters.propertyType) {
        searchParams.set('propertyType', newFilters.propertyType);
      }

      if (newFilters.priceRange) {
        searchParams.set('priceMin', newFilters.priceRange[0].toString());
        searchParams.set('priceMax', newFilters.priceRange[1].toString());
      }

      router.push(`${paths.home}?${searchParams.toString()}`);
    },
    [router]
  );

  const handleClearFilters = React.useCallback(() => {
    updateSearchParams({}, sortDir);
  }, [updateSearchParams, sortDir]);

  const handleFilterChange = React.useCallback(
    (key: string, value?: string | number | [number, number]) => {
      const newFilters = { ...filters, [key]: value };
      if (value === undefined) {
        delete newFilters[key];
      }
      updateSearchParams(newFilters, sortDir);
    },
    [filters, updateSearchParams, sortDir]
  );

  const handleSortChange = React.useCallback(
    (event: SelectChangeEvent) => {
      updateSearchParams(filters, event.target.value as SortDir);
    },
    [updateSearchParams, filters]
  );

  const hasFilters = propertyType || priceRange;

  return (
    <div>
      <Divider />
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap', p: 2 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flex: '1 1 auto', flexWrap: 'wrap' }}>
          <FilterButton
            displayValue={propertyType || undefined}
            label={t('propertyType')}
            onFilterApply={(value) => handleFilterChange('propertyType', value as string)}
            onFilterDelete={() => handleFilterChange('propertyType')}
            popover={<PropertyTypeFilterPopover />}
            value={propertyType || undefined}
          />
          <FilterButton
            displayValue={priceRange ? `${priceRange[0]} - ${priceRange[1]}` : undefined}
            label={t('priceRange')}
            onFilterApply={(value) => handleFilterChange('priceRange', value as [number, number])}
            onFilterDelete={() => handleFilterChange('priceRange')}
            popover={<PriceRangeFilterPopover />}
            value={priceRange ? `${priceRange[0]} - ${priceRange[1]}` : undefined}
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

function PropertyTypeFilterPopover(): React.JSX.Element {
  const { t } = useTranslation();
  const { anchorEl, onApply, onClose, open, value: initialValue } = useFilterContext();
  const [value, setValue] = React.useState<string>('');

  React.useEffect(() => {
    setValue((initialValue as string | undefined) ?? '');
  }, [initialValue]);

  return (
    <FilterPopover anchorEl={anchorEl} onClose={onClose} open={open} title={t('filterByPropertyType')}>
      <FormControl>
        <Select
          onChange={(event) => setValue(event.target.value)}
          value={value}
        >
          <Option value="">{t('selectPropertyType')}</Option>
          <Option value="house">{t('house')}</Option>
          <Option value="apartment">{t('apartment')}</Option>
          {/* Ajoutez d'autres types de propriétés ici */}
        </Select>
      </FormControl>
      <Button
        onClick={() => onApply(value)}
        variant="contained"
      >
        {t('apply')}
      </Button>
    </FilterPopover>
  );
}

function PriceRangeFilterPopover(): React.JSX.Element {
  const { t } = useTranslation();
  const { anchorEl, onApply, onClose, open, value: initialValue } = useFilterContext();
  const [minValue, setMinValue] = React.useState<number | string>('');
  const [maxValue, setMaxValue] = React.useState<number | string>('');

  React.useEffect(() => {
    if (initialValue) {
      const [min, max] = initialValue as [number, number];
      setMinValue(min ?? '');
      setMaxValue(max ?? '');
    }
  }, [initialValue]);

  return (
    <FilterPopover anchorEl={anchorEl} onClose={onClose} open={open} title={t('filterByPriceRange')}>
      <FormControl>
        <OutlinedInput
          placeholder={t('minPrice')}
          type="number"
          onChange={(event) => setMinValue(event.target.value)}
          value={minValue}
        />
      </FormControl>
      <FormControl>
        <OutlinedInput
          placeholder={t('maxPrice')}
          type="number"
          onChange={(event) => setMaxValue(event.target.value)}
          value={maxValue}
        />
      </FormControl>
      <Button
        onClick={() => onApply([Number(minValue), Number(maxValue)])}
        variant="contained"
      >
        {t('apply')}
      </Button>
    </FilterPopover>
  );
}
