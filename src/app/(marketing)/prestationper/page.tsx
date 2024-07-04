import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import { Per } from '@/components/marketing/home/per';

export const metadata = { title: config.site.name, description: config.site.description } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <main>
      <Per />
    </main>
  );
}
