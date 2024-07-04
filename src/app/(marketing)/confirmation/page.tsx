import * as React from 'react';
import type { Metadata } from 'next';

import Confirmation from '@/components/marketing/home/confirmation';

export default function Page(): React.JSX.Element {
  return (
    <main>
      <Confirmation />
    </main>
  );
}