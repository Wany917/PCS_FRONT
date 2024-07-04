import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { GridList2 } from '@/components/widgets/grid-lists/grid-list-2';

export const metadata = { title: config.site.name, description: config.site.description } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <main>
      <Box sx={{ width: '100%', padding: 2 }}>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <GridList2 />
          </Grid>
        </Grid>
      </Box>
    </main>
  );
}
