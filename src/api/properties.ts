import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher, endpoints } from '../lib/axios';

export interface PropertyFilters {
  category?: string;
  country?: string;
  priceRange?: [number, number];
  roomNumber?: number;
  squareMetersRange?: [number, number];
  status?: 'published' | 'draft';
  sortDir?: 'asc' | 'desc';
}

export function useGetProperties(filters: PropertyFilters = {}) {
  // Construct the query string based on filters
  const queryParams = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      if (Array.isArray(value)) { // Handle range filters specially
        queryParams.append(`${key}Min`, value[0].toString());
        queryParams.append(`${key}Max`, value[1].toString());
      } else {
        queryParams.append(key, value.toString());
      }
    }
  });

  const queryString = queryParams.toString();
  const URL = `${endpoints.properties.list}?${queryString}`;

  const { data, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(() => {
    if (error) {
      console.error(error);
    }
    return {
      properties: data?.data || [],
      propertiesLoading: !data && !error,
      propertiesError: error,
      propertiesValidating: isValidating,
      propertiesEmpty: data?.data && data.data.length === 0,
    };
  }, [data, error, isValidating]);

  return memoizedValue;
}
