import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from '../lib/axios';

export function useGetSocieties() {
  const URL = endpoints.societies.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      societies: data?.data || [],
      societiesLoading: isLoading,
      societiesError: error,
      societiesValidating: isValidating,
      societiesEmpty: !isLoading && !data?.data.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetSociety(societyId: number) {
  const URL = endpoints.societies.get(societyId);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      society: data! || {},
      societyLoading: isLoading,
      societyError: error,
      societyValidating: isValidating,
    }),
    [data!, error, isLoading, isValidating]
  );

  return memoizedValue;
}