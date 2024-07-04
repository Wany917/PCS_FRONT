import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import { Hero } from '@/components/marketing/home/hero';
import { Included } from '@/components/marketing/home/included';
import { Features } from '@/components/marketing/home/features';


export const metadata = { title: config.site.name, description: config.site.description } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <main>
      <Features />
    </main>
  );
}
