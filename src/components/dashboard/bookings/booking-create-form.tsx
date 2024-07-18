'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { Camera as CameraIcon } from '@phosphor-icons/react/dist/ssr/Camera';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { useTranslation } from 'react-i18next';

import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { Option } from '@/components/core/option';
import { toast } from '@/components/core/toaster';
import axios, { endpoints } from '@/lib/axios';

function fileToBase64(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      reject(new Error('Error converting file to base64'));
    };
  });
}

function base64ToFile(base64: string): Blob {
  const matches = base64.match(/^data:(.*?);base64,/);
  const mimeType = matches && matches[1] ? matches[1] : 'image/jpeg';
  const base64Data = base64.split(';base64,').pop();
  const byteCharacters = atob(base64Data || '');
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: mimeType });
}

const schema = zod.object({
  userId: zod.number().int().positive(),
  propertyId: zod.number().int().positive(),
  propertyName: zod.string(),
  guests: zod.number().int().positive(),
  pricePerNight: zod.number().int().positive(),
  totalPriceNight: zod.number().int().positive(),
  serviceFee: zod.number().int().positive(),
  discount: zod.number().int().positive(),
  totalPrice: zod.number().int().positive(),
  nights: zod.number().int().positive(),
  startDate: zod.string(),
  endDate: zod.string(),
});

type Values = zod.infer<typeof schema>;

const defaultValues = {
  userId: 0,
  propertyId: 0,
  propertyName: '',
  guests: 0,
  pricePerNight: 0,
  totalPriceNight: 0,
  serviceFee: 0,
  discount: 0,
  totalPrice: 0,
  nights: 0,
  startDate: '',
  endDate: '',
} satisfies Values;

export function CustomerCreateForm(): React.JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      try {
        const response = await axios.post(endpoints.users.post, values);

        if (response.data && response.data.id) {
          if (values.avatar) {
            const file = base64ToFile(values.avatar);
            const formData = new FormData();
            formData.append('avatar', file);

            await axios.put(endpoints.users.avatar.put(response.data.id), formData);
          }

          toast.success(t('customerCreated'));
          return router.push(paths.dashboard.customers.details(response.data.id));
        }
      } catch (err) {
        logger.error(err);
        toast.error(t('somethingWentWrong'));
      }
    },
    [router, t]
  );

  const avatarInputRef = React.useRef<HTMLInputElement>(null);
  const avatar = watch('avatar');

  const handleAvatarChange = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (file) {
        const url = await fileToBase64(file);
        setValue('avatar', url);
      }
    },
    [setValue]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent>
          <Stack divider={<Divider />} spacing={4}>
            <Stack spacing={3}>
              <Typography variant="h6">{t('bookingInformation')}</Typography>
              <Grid container spacing={3}>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="firstname"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.firstname)} fullWidth>
                        <InputLabel required>{t('firstname')}</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.firstname ? (
                          <FormHelperText>{t(errors.firstname.message)}</FormHelperText>
                        ) : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="lastname"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.lastname)} fullWidth>
                        <InputLabel required>{t('lastname')}</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.lastname ? (
                          <FormHelperText>{t(errors.lastname.message)}</FormHelperText>
                        ) : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.email)} fullWidth>
                        <InputLabel required>{t('email')}</InputLabel>
                        <OutlinedInput {...field} type="email" />
                        {errors.email ? (
                          <FormHelperText>{t(errors.email.message)}</FormHelperText>
                        ) : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.password)} fullWidth>
                        <InputLabel required>{t('password')}</InputLabel>
                        <OutlinedInput {...field} type="password" />
                        {errors.password ? (
                          <FormHelperText>{t(errors.password.message)}</FormHelperText>
                        ) : null}
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
            </Stack>
            <Stack spacing={3}>
              <Typography variant="h6">{t('billingInformation')}</Typography>
              <Grid container spacing={3}>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="country"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.country)} fullWidth>
                        <InputLabel required>{t('country')}</InputLabel>
                        <Select {...field}>
                          <Option value="">{t('chooseCountry')}</Option>
                          <Option value="us">{t('unitedStates')}</Option>
                          <Option value="de">{t('germany')}</Option>
                          <Option value="es">{t('spain')}</Option>
                        </Select>
                        {errors.country ? (
                          <FormHelperText>{t(errors.country.message)}</FormHelperText>
                        ) : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="state"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.state)} fullWidth>
                        <InputLabel required>{t('state')}</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.state ? (
                          <FormHelperText>{t(errors.state.message)}</FormHelperText>
                        ) : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="city"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.city)} fullWidth>
                        <InputLabel required>{t('city')}</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.city ? (
                          <FormHelperText>{t(errors.city.message)}</FormHelperText>
                        ) : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.zipCode)} fullWidth>
                        <InputLabel required>{t('zipCode')}</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.zipCode ? (
                          <FormHelperText>{t(errors.zipCode.message)}</FormHelperText>
                        ) : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="line1"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.line1)} fullWidth>
                        <InputLabel required>{t('line1')}</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.line1 ? (
                          <FormHelperText>{t(errors.line1.message)}</FormHelperText>
                        ) : null}
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
            </Stack>
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button color="secondary" component={RouterLink} href={paths.dashboard.customers.list}>
            {t('cancel')}
          </Button>
          <Button type="submit" variant="contained">
            {t('createCustomer')}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
