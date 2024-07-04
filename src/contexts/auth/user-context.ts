import type * as React from 'react';

import { UserContext as CustomUserContext, UserProvider as CustomUserProvider } from './custom/user-context';
import type { UserContextValue } from './types';

// eslint-disable-next-line import/no-mutable-exports -- Export based on config
let UserProvider: React.FC<{ children: React.ReactNode }>;

// eslint-disable-next-line import/no-mutable-exports -- Export based on config
let UserContext: React.Context<UserContextValue | undefined>;

UserContext = CustomUserContext;
UserProvider = CustomUserProvider;

export { UserProvider, UserContext };
