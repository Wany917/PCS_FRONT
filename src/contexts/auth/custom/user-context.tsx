'use client';

import * as React from 'react';
import type { User } from '@/types/user';
import { logger } from '@/lib/default-logger';
import type { UserContextValue } from '../types';
import axiosInstance, { endpoints } from '@/lib/axios';

export const UserContext = React.createContext<UserContextValue | undefined>(undefined);

export interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps): React.JSX.Element {
  const [state, setState] = React.useState<{ user: User | null; error: string | null; isLoading: boolean }>({
    user: null,
    error: null,
    isLoading: true,
  });

  const checkSession = React.useCallback(async (): Promise<void> => {
    try {
      const response = await axiosInstance.get(endpoints.auth.me);
      if (response.data?.error) {
        logger.error(response.data.error.message);
        setState((prev) => ({ ...prev, user: null, error: null, isLoading: false }));
        return;
      }
      setState((prev) => ({ ...prev, user: response.data ?? null, error: null, isLoading: false }));
    } catch (err) {
      logger.error(err);
      setState((prev) => ({ ...prev, user: null, error: null, isLoading: false }));
    }
  }, []);

  React.useEffect(() => {
    checkSession().catch((err) => {
      logger.error(err);
      // noop
    });
  }, [checkSession]);

  return <UserContext.Provider value={{ ...state, checkSession }}>{children}</UserContext.Provider>;
}

export const UserConsumer = UserContext.Consumer;
