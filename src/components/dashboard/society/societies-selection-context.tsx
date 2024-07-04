'use client';

import * as React from 'react';

import { useSelection } from '@/hooks/use-selection';
import type { Selection } from '@/hooks/use-selection';

import { Society } from './societies-table';

function noop(): void {
  return undefined;
}

export interface SocietiesSelectionContextValue extends Selection {}

export const SocietiesSelectionContext = React.createContext<SocietiesSelectionContextValue>({
  deselectAll: noop,
  deselectOne: noop,
  selectAll: noop,
  selectOne: noop,
  selected: new Set(),
  selectedAny: false,
  selectedAll: false,
});

interface SocietiesSelectionProviderProps {
  children: React.ReactNode;
  societies: Society[];
}

export function SocietiesSelectionProvider({
  children,
  societies = [],
}: SocietiesSelectionProviderProps): React.JSX.Element {
  const societyIds = React.useMemo(() => societies.map((society) => society.id), [societies]);
  const selection = useSelection(societyIds);

  return <SocietiesSelectionContext.Provider value={{ ...selection }}>{children}</SocietiesSelectionContext.Provider>;
}

export function useSocietiesSelection(): SocietiesSelectionContextValue {
  return React.useContext(SocietiesSelectionContext);
}
