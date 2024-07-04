import { getSiteURL } from '@/lib/get-site-url';
import { LogLevel } from '@/lib/logger';
import type { ColorScheme, PrimaryColor } from '@/styles/theme/types';

export interface Config {
  site: {
    name: string;
    description: string;
    colorScheme: ColorScheme;
    primaryColor: PrimaryColor;
    themeColor: string;
    url: string;
    version: string;
  };
  logLevel: keyof typeof LogLevel;
  mapbox: { apiKey?: string };
  gtm?: { id?: string };
}

export const config = {
  site: {
    name: 'Devias Kit Pro',
    description: '',
    colorScheme: 'light',
    themeColor: '#090a0b',
    primaryColor: 'neonBlue',
    url: getSiteURL(),
    version: process.env.NEXT_PUBLIC_SITE_VERSION || '0.0.0',
  },
  logLevel: (process.env.NEXT_PUBLIC_LOG_LEVEL as keyof typeof LogLevel) || LogLevel.ALL,
  mapbox: { apiKey: process.env.NEXT_PUBLIC_MAPBOX_API_KEY },
  gtm: { id: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID },
} satisfies Config;
