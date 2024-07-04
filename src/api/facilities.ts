import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher, endpoints } from '../lib/axios';

export function useGetFacilities() {
  const URL = endpoints.facilities.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      facilities: data?.data || [],
      facilitiesLoading: isLoading,
      facilitiesError: error,
      facilitiesValidating: isValidating,
      facilitiesEmpty: !isLoading && !data?.data.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetFacility(facilityId: number) {
  const URL = endpoints.facilities.get(facilityId);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      facility: data || {},
      facilityLoading: isLoading,
      facilityError: error,
      facilityValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
