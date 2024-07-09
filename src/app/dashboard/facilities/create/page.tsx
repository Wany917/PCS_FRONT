'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { CardActions, FormHelperText, Grid, Link, OutlinedInput } from '@mui/material';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { paths } from '@/paths';
import axios, { endpoints } from '@/lib/axios';
import { toast } from 'sonner';

const schema = zod.object({
  name: zod.string().min(1, 'Name is required').max(255),
});

type Values = zod.infer<typeof schema>;

const defaultValues: Values = {
  name: '',
};

export default function CreateFacilityPage(): React.JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(async (values: Values): Promise<void> => {
    try {
      const response = await axios.post(endpoints.facilities.post, values);

      if (response.data && response.data.id) {
        toast.success(t('facilityCreated'));
        router.push(paths.dashboard.facilities.list);
      }
    } catch (error) {
      console.error(error);
    }
      
  }, [router, t]);

  return (
    <Box
    sx={{
      maxWidth: 'var(--Content-maxWidth)',
      m: 'var(--Content-margin)',
      p: 'var(--Content-padding)',
      width: 'var(--Content-width)',
    }}
  >
    <Stack spacing={4}>
      <Stack spacing={3}>
        <div>
          <Link
            color="text.primary"
            component={RouterLink}
            href={paths.dashboard.facilities.list}
            sx={{ alignItems: 'center', display: 'inline-flex', gap: 1 }}
            variant="subtitle2"
          >
            <ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />
            {t('facilities')}
          </Link>
        </div>
        <div>
          <Typography variant="h4">{t('createProperty')}</Typography>
        </div>
      </Stack>
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid md={8} xs={12}>
          <Card>
            <CardContent>
                <Stack spacing={3}>
                  <Grid container spacing={3}>
                    <Grid md={6} xs={12}>
                      <Controller
                        control={control}
                        name="name"
                        render={({ field }) => (
                          <FormControl error={Boolean(errors.name)} fullWidth>
                            <InputLabel required>{t('name')}</InputLabel>
                            <OutlinedInput {...field} />
                            {errors.name ? (
                              <FormHelperText>{errors.name.message}</FormHelperText>
                            ) : null}
                          </FormControl>
                        )}
                      />
                    </Grid>
                  </Grid>
              </Stack>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Button type="submit" variant="contained">
                {t('create')}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </form>
    </Stack>
    </Box>
  );
}
