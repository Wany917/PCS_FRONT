import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from '../lib/axios';

export function useGetUsers() {
  const URL = endpoints.users.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      users: data?.data || [],
      usersLoading: isLoading,
      usersError: error,
      usersValidating: isValidating,
      usersEmpty: !isLoading && !data?.data.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetUser(userId: number) {
  const URL = endpoints.users.get(userId);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      user: data! || {},
      userLoading: isLoading,
      userError: error,
      userValidating: isValidating,
    }),
    [data!, error, isLoading, isValidating]
  );

  return memoizedValue;
}