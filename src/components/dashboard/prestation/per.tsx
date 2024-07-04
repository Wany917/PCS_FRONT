'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { GridList7 } from '@/components/widgets/grid-lists/grid-list-7';

export function Per(): React.JSX.Element {
  const numberOfGrids = 1;

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <Grid container spacing={5}>
        {Array.from({ length: numberOfGrids }).map((_, index) => (
          <Grid item xs={12} key={index}>
            <GridList7 />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
