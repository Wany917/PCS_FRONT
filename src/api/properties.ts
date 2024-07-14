import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher, endpoints } from '../lib/axios';

interface PropertyFilters {
  propertyType?: string;
  country?: string;
  state?: string;
  city?: string;
  priceRange?: [number, number];
  bedrooms?: number;
  bathrooms?: number;
}

export function useGetProperties(filters: PropertyFilters) {
  const URL = `${endpoints.properties.list}?${new URLSearchParams(filters as any).toString()}`;

  const { data, isLoading, error, isValidating } = useSWR([URL, filters], fetcher);

  const memoizedValue = useMemo(
    () => ({
      properties: data?.data || [],
      propertiesLoading: isLoading,
      propertiesError: error,
      propertiesValidating: isValidating,
      propertiesEmpty: !isLoading && !data?.data.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
export function useGetProperty(propertyId: number) {
  const URL = endpoints.properties.get(propertyId);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      property: data || {},
      propertyLoading: isLoading,
      propertyError: error,
      propertyValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}