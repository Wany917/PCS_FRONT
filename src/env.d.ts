export interface Env {
  HOST_API_URL?: string;
  // App
  NEXT_PUBLIC_SITE_URL?: string;
  NEXT_PUBLIC_SITE_VERSION?: string;
  NEXT_PUBLIC_VERCEL_URL?: string;
  NEXT_PUBLIC_UPLOADS_URL?: string;

  // Logger
  NEXT_PUBLIC_LOG_LEVEL?: string;

  // Auth
  NEXT_PUBLIC_AUTH_STRATEGY?: string;

  // Mapbox
  NEXT_PUBLIC_MAPBOX_API_KEY?: string;

  // Google Tag Manager
  NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID?: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}
