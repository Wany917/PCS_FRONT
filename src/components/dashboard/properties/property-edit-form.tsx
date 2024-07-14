'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { Image as ImageIcon } from '@phosphor-icons/react/dist/ssr/Image';
import { Info as InfoIcon } from '@phosphor-icons/react/dist/ssr/Info';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import type { EditorEvents } from '@tiptap/react';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import type { ColumnDef } from '@/components/core/data-table';
import { DataTable } from '@/components/core/data-table';
import type { File } from '@/components/core/file-dropzone';
import { FileDropzone } from '@/components/core/file-dropzone';
import { Option } from '@/components/core/option';
import { TextEditor } from '@/components/core/text-editor/text-editor';
import { toast } from '@/components/core/toaster';
import { useTranslation } from 'react-i18next';

export interface Image {
  id: string;
  url: string;
  fileName: string;
}

export interface Property {
  id: number;
  title: string;
  propertyType: string;
  description: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  line1: string;
  price: number;
  images: Image[];
  bedrooms: number;
  bathrooms: number;
  beds: number;
  userId: number;
  isPrivate: boolean;
}

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

function getImageColumns({ onRemove }: { onRemove?: (imageId: string) => void }): ColumnDef<Image>[] {
  return [
    {
      formatter: (row): React.JSX.Element => {
        return (
          <Box
            sx={{
              backgroundImage: `url(${row.url})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              bgcolor: 'var(--mui-palette-background-level2)',
              borderRadius: 1,
              flex: '0 0 auto',
              height: '40px',
              width: '40px',
            }}
          />
        );
      },
      name: 'Image',
      width: '100px',
    },
    { field: 'fileName', name: 'File name', width: '300px' },
    {
      formatter: (row): React.JSX.Element => (
        <IconButton
          onClick={() => {
            onRemove?.(row.id);
          }}
        >
          <TrashIcon />
        </IconButton>
      ),
      name: 'Actions',
      hideName: true,
      width: '100px',
      align: 'right',
    },
  ];
}

const schema = zod.object({
  title: zod.string().min(1, 'Title is required').max(255),
  propertyType: zod.string().min(1, 'Property type is required').max(255),
  description: zod.string().max(5000).optional(),
  country: zod.string().min(1, 'Country is required').max(255),
  state: zod.string().optional(),
  city: zod.string().min(1, 'City is required').max(255),
  zipCode: zod.string().min(1, 'Zip code is required').max(255),
  line1: zod.string().min(1, 'Address is required').max(255),
  price: zod.number().min(0, 'Price must be greater than or equal to 0'),
  images: zod.array(zod.object({ id: zod.string(), url: zod.string(), fileName: zod.string() })),
  bedrooms: zod.number().min(1, 'Bedrooms must be greater than or equal to 1').max(8),
  bathrooms: zod.number().min(1, 'Bathrooms must be greater than or equal to 1').max(8),
  beds: zod.number().min(1, 'Beds must be greater than or equal to 1').max(8),
  userId: zod.number().positive().int().min(1, 'Owner is required'),
  isPrivate: zod.boolean().optional(),
});

type Values = zod.infer<typeof schema>;

function getDefaultValues(property: Property): Values {
  return {
    title: property.title,
    propertyType: property.propertyType,
    description: property.description,
    country: property.country,
    state: property.state,
    city: property.city,
    zipCode: property.zipCode,
    line1: property.line1,
    price: property.price,
    images: property.images,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    beds: property.beds,
    userId: property.userId,
    isPrivate: property.isPrivate,
  };
}

export interface PropertyEditFormProps {
  property: Property;
}

export function PropertyEditForm({ property }: PropertyEditFormProps): React.JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm<Values>({ defaultValues: getDefaultValues(property), resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      try {
        // Make API request
        toast.success(t('propertyUpdated'));
        router.push(paths.dashboard.properties.list);
      } catch (err) {
        logger.error(err);
        toast.error(t('somethingWentWrong'));
      }
    },
    [router, t]
  );

  const handleImageDrop = React.useCallback(
    async (files: File[]) => {
      const images = await Promise.all(
        files.map(async (file) => {
          const url = await fileToBase64(file);
          return { id: `IMG-${Date.now()}`, url, fileName: file.name };
        })
      );

      setValue('images', [...getValues('images'), ...images]);
    },
    [getValues, setValue]
  );

  const handleImageRemove = React.useCallback(
    (imageId: string) => {
      setValue(
        'images',
        getValues('images').filter((image) => image.id !== imageId)
      );
    },
    [getValues, setValue]
  );

  const title = watch('title');
  const description = watch('description');
  const propertyType = watch('propertyType');
  const country = watch('country');
  const state = watch('state');
  const city = watch('city');
  const zipCode = watch('zipCode');
  const line1 = watch('line1');
  const price = watch('price');
  const bedrooms = watch('bedrooms');
  const bathrooms = watch('bathrooms');
  const beds = watch('beds');
  const images = watch('images');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4}>
        <Grid md={8} xs={12}>
          <Card>
            <CardContent>
              <Stack spacing={3}>
                <Typography variant="h6">{t('basicInformation')}</Typography>
                <Grid container spacing={3}>
                  <Grid md={6} xs={12}>
                    <Controller
                      control={control}
                      name="title"
                      render={({ field }) => (
                        <FormControl error={Boolean(errors.title)} fullWidth>
                          <InputLabel required>{t('title')}</InputLabel>
                          <OutlinedInput {...field} />
                          {errors.title ? <FormHelperText>{errors.title.message}</FormHelperText> : null}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid md={6} xs={12}>
                    <Controller
                      control={control}
                      name="propertyType"
                      render={({ field }) => (
                        <FormControl error={Boolean(errors.propertyType)} fullWidth>
                          <InputLabel required>{t('propertyType')}</InputLabel>
                          <Select {...field}>
                            <Option value="house">{t('house')}</Option>
                            <Option value="apartment">{t('apartment')}</Option>
                            <Option value="guestHouse">{t('guestHouse')}</Option>
                            <Option value="hotel">{t('hotel')}</Option>
                          </Select>
                          {errors.propertyType ? <FormHelperText>{errors.propertyType.message}</FormHelperText> : null}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid md={6} xs={12}>
                    <Controller
                      control={control}
                      name="country"
                      render={({ field }) => (
                        <FormControl error={Boolean(errors.country)} fullWidth>
                          <InputLabel required>{t('country')}</InputLabel>
                          <OutlinedInput {...field} />
                          {errors.country ? <FormHelperText>{errors.country.message}</FormHelperText> : null}
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
                          <InputLabel>{t('state')}</InputLabel>
                          <OutlinedInput {...field} />
                          {errors.state ? <FormHelperText>{errors.state.message}</FormHelperText> : null}
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
                          {errors.city ? <FormHelperText>{errors.city.message}</FormHelperText> : null}
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
                          {errors.zipCode ? <FormHelperText>{errors.zipCode.message}</FormHelperText> : null}
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
                          <InputLabel required>{t('address')}</InputLabel>
                          <OutlinedInput {...field} />
                          {errors.line1 ? <FormHelperText>{errors.line1.message}</FormHelperText> : null}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid md={6} xs={12}>
                    <Controller
                      control={control}
                      name="price"
                      render={({ field }) => (
                        <FormControl error={Boolean(errors.price)} fullWidth>
                          <InputLabel required>{t('price')}</InputLabel>
                          <OutlinedInput {...field} inputProps={{ min: 0 }} type="number" />
                          {errors.price ? <FormHelperText>{errors.price.message}</FormHelperText> : null}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid md={6} xs={12}>
                    <Controller
                      control={control}
                      name="bedrooms"
                      render={({ field }) => (
                        <FormControl error={Boolean(errors.bedrooms)} fullWidth>
                          <InputLabel required>{t('bedrooms')}</InputLabel>
                          <OutlinedInput {...field} inputProps={{ min: 1, max: 8 }} type="number" />
                          {errors.bedrooms ? <FormHelperText>{errors.bedrooms.message}</FormHelperText> : null}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid md={6} xs={12}>
                    <Controller
                      control={control}
                      name="bathrooms"
                      render={({ field }) => (
                        <FormControl error={Boolean(errors.bathrooms)} fullWidth>
                          <InputLabel required>{t('bathrooms')}</InputLabel>
                          <OutlinedInput {...field} inputProps={{ min: 1, max: 8 }} type="number" />
                          {errors.bathrooms ? <FormHelperText>{errors.bathrooms.message}</FormHelperText> : null}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid md={6} xs={12}>
                    <Controller
                      control={control}
                      name="beds"
                      render={({ field }) => (
                        <FormControl error={Boolean(errors.beds)} fullWidth>
                          <InputLabel required>{t('beds')}</InputLabel>
                          <OutlinedInput {...field} inputProps={{ min: 1, max: 8 }} type="number" />
                          {errors.beds ? <FormHelperText>{errors.beds.message}</FormHelperText> : null}
                        </FormControl>
                      )}
                    />
                  </Grid>
                </Grid>
                <Stack spacing={3}>
                  <Typography variant="h6">{t('description')}</Typography>
                  <Controller
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.description)} fullWidth>
                        <InputLabel>{t('description')}</InputLabel>
                        <Box sx={{ mt: '8px', '& .tiptap-container': { height: '400px' } }}>
                          <TextEditor
                            content={field.value ?? ''}
                            onUpdate={({ editor }: EditorEvents['update']) => {
                              field.onChange(editor.getText());
                            }}
                            placeholder={t('writeSomething')}
                          />
                        </Box>
                        {errors.description ? <FormHelperText error>{errors.description.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Stack>
                <Stack spacing={3}>
                  <Typography variant="h6">{t('images')}</Typography>
                  <Card sx={{ borderRadius: 1 }} variant="outlined">
                    <DataTable<Image> columns={getImageColumns({ onRemove: handleImageRemove })} rows={images} />
                    {images.length === 0 ? (
                      <Box sx={{ p: 1 }}>
                        <Typography align="center" color="text.secondary" variant="body2">
                          {t('noImages')}
                        </Typography>
                      </Box>
                    ) : null}
                  </Card>
                  <FileDropzone accept={{ 'image/*': [] }} caption={t('imageFormats')} onDrop={handleImageDrop} />
                </Stack>
              </Stack>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Button color="secondary" component={RouterLink} href={paths.dashboard.properties.list}>
                {t('cancel')}
              </Button>
              <Button type="submit" variant="contained">
                {t('saveChanges')}
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid md={4} xs={12}>
          <Stack spacing={3}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  {images.length ? (
                    <Box
                      sx={{
                        backgroundImage: `url(${images[0].url})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        bgcolor: 'var(--mui-palette-background-level2)',
                        borderRadius: 1,
                        display: 'flex',
                        height: '100px',
                        width: '100px',
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        alignItems: 'center',
                        bgcolor: 'var(--mui-palette-background-level2)',
                        borderRadius: 1,
                        display: 'flex',
                        height: '100px',
                        justifyContent: 'center',
                        width: '100px',
                      }}
                    >
                      <ImageIcon fontSize="var(--icon-fontSize-lg)" />
                    </Box>
                  )}
                  <div>
                    <Typography color={title ? 'text.primary' : 'text.disabled'} variant="subtitle1">
                      {title || t('propertyTitle')}
                    </Typography>
                    <Typography color={propertyType ? 'text.secondary' : 'text.disabled'} variant="body2">
                      {t('propertyType')}: {propertyType || t('notSpecified')}
                    </Typography>
                  </div>
                  <Typography color="text.primary" variant="body2">
                    {t('price')}: ${price || 0}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {t('address')}:
                    <br />
                    {line1 ? `${line1}, ` : ''}
                    {zipCode ? `${zipCode} ` : ''}
                    {city ? `${city}, ` : ''}
                    {state ? `${state}, ` : ''}
                    {country}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {t('bedrooms')}: {bedrooms}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {t('bathrooms')}: {bathrooms}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {t('beds')}: {beds}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
}
