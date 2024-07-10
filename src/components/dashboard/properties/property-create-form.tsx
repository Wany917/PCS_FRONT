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
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { Option } from '@/components/core/option';
import { TextEditor } from '@/components/core/text-editor/text-editor';
import { toast } from '@/components/core/toaster';
import { FileDropzone } from '@/components/core/file-dropzone';
import { DataTable } from '@/components/core/data-table';
import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { Image as ImageIcon } from '@phosphor-icons/react/dist/ssr/Image';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import type { EditorEvents } from '@tiptap/react';
import type { File } from '@/components/core/file-dropzone';
import type { ColumnDef } from '@/components/core/data-table';
import { Autocomplete, IconButton, TextField } from '@mui/material';
import type { Customer } from '@/types/customer';
import { useGetUsers } from '@/api/users';
import axios, { endpoints } from '@/lib/axios';
import { useTranslation } from 'react-i18next';
import { useGetFacilities } from '@/api/facilities';

export interface Image {
  id: string;
  url: string;
  fileName: string;
}

const schema = zod.object({
  title: zod.string().min(1, 'Title is required').max(255),
  description: zod.string().max(5000).optional(),
  propertyType: zod.string().min(1, 'Property type is required'),
  country: zod.string().min(1, 'Country is required'),
  state: zod.string().optional(),
  city: zod.string().min(1, 'City is required'),
  zipCode: zod.string().min(1, 'Zip code is required'),
  line1: zod.string().min(1, 'Address is required'),
  price: zod.coerce.number().min(1, 'Price must be greater than or equal to 0'),
  images: zod.array(zod.object({ id: zod.string(), url: zod.string(), fileName: zod.string() })),
  bedrooms: zod.coerce
    .number()
    .min(1, 'Bedrooms must be greater than or equal to 1')
    .max(8, 'Bedrooms must be less than or equal to 8'),
  bathrooms: zod.coerce
    .number()
    .min(1, 'Bathrooms must be greater than or equal to 1')
    .max(8, 'Bathrooms must be less than or equal to 8'),
  beds: zod.coerce
    .number()
    .min(1, 'Beds must be greater than or equal to 1')
    .max(8, 'Beds must be less than or equal to 8'),
  userId: zod.number().int().min(1, 'Owner is required').positive(),
  isPrivate: zod.boolean().optional(),
});

type Values = zod.infer<typeof schema>;

const defaultValues: Values = {
  title: '',
  description: '',
  propertyType: '',
  country: '',
  state: '',
  city: '',
  zipCode: '',
  line1: '',
  price: 0,
  images: [],
  bedrooms: 1,
  bathrooms: 1,
  beds: 1,
  userId: 0,
  isPrivate: false,
};

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
  // Extract MIME type from the base64 string header
  const matches = /^data:(.*?);base64,/.exec(base64);
  const mimeType = matches && matches[1] ? matches[1] : 'image/jpeg'; // Default to image/jpeg

  // Extract pure base64 data without header
  const base64Data = base64.split(';base64,').pop();

  // Convert base64 string to binary data
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

  // Create a blob from the byteArrays
  return new Blob(byteArrays, { type: mimeType });
}

function getImageColumns({
  onRemove,
}: {
  onRemove?: (imageId: string) => void;
}): ColumnDef<Image>[] {
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

export function PropertyCreateForm(): React.JSX.Element {
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

  const { users, usersLoading } = useGetUsers();
  const { facilities, facilitiesLoading } = useGetFacilities();
  const [selectedFacilities, setSelectedFacilities] = React.useState<number[]>([]);

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      try {
        // Convertir les données en FormData
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', 'TEST');
        formData.append('propertyType', values.propertyType);
        formData.append('country', values.country);
        formData.append('state', 'TEST');
        formData.append('city', values.city);
        formData.append('zipCode', values.zipCode);
        formData.append('line1', values.line1);
        formData.append('price', values.price.toString());
        formData.append('bedrooms', values.bedrooms.toString());
        formData.append('bathrooms', values.bathrooms.toString());
        formData.append('beds', values.beds.toString());
        formData.append('userId', values.userId.toString());
        formData.append('isPrivate', values.isPrivate ? 'true' : 'false');
        selectedFacilities.forEach(facilityId => {
          formData.append('facilities[]', facilityId.toString());
        });

        if (values.images && values.images.length > 0) {
          values.images.forEach((image, index) => {
            const file = base64ToFile(image.url);
            formData.append(`images[${index}]`, file, image.fileName);
          });
        }

        const response = await axios.post(endpoints.properties.create, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 201 || response.status === 200) {
          toast.success(t('propertyCreatedSuccessfully'));
          router.push(paths.dashboard.properties.list);
        } else {
          toast.error(t('failedToCreateProperty'));
        }
      } catch (err) {
        logger.error(err);
        toast.error(t('somethingWentWrong'));
      }
    },
    [router, t, selectedFacilities]
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

  const images = watch('images');
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid md={8} xs={12}>
          <Card>
            <CardContent>
              <Stack spacing={3}>
                <Typography variant="h6">{t('createProperty')}</Typography>
                <Stack spacing={3}>
                  <Grid container spacing={3}>
                    <Grid md={6} xs={12}>
                      <Controller
                        control={control}
                        name="title"
                        render={({ field }) => (
                          <FormControl error={Boolean(errors.title)} fullWidth>
                            <InputLabel required>{t('title')}</InputLabel>
                            <OutlinedInput {...field} />
                            {errors.title ? (
                              <FormHelperText>{errors.title.message}</FormHelperText>
                            ) : null}
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
                              <Option value="">{t('choosePropertyType')}</Option>
                              <Option value="house">{t('house')}</Option>
                              <Option value="apartment">{t('apartment')}</Option>
                              <Option value="guestHouse">{t('guestHouse')}</Option>
                              <Option value="hotel">{t('hotel')}</Option>
                            </Select>
                            {errors.propertyType ? (
                              <FormHelperText>{errors.propertyType.message}</FormHelperText>
                            ) : null}
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
                            {errors.country ? (
                              <FormHelperText>{errors.country.message}</FormHelperText>
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
                            <InputLabel>{t('state')}</InputLabel>
                            <OutlinedInput {...field} />
                            {errors.state ? (
                              <FormHelperText>{errors.state.message}</FormHelperText>
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
                              <FormHelperText>{errors.city.message}</FormHelperText>
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
                              <FormHelperText>{errors.zipCode.message}</FormHelperText>
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
                            <InputLabel required>{t('address')}</InputLabel>
                            <OutlinedInput {...field} />
                            {errors.line1 ? (
                              <FormHelperText>{errors.line1.message}</FormHelperText>
                            ) : null}
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
                            <OutlinedInput {...field} inputProps={{ min: 1 }} type="number" />
                            {errors.price ? (
                              <FormHelperText>{errors.price.message}</FormHelperText>
                            ) : null}
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
                            <OutlinedInput
                              {...field}
                              inputProps={{ min: 1, max: 8 }}
                              type="number"
                            />
                            {errors.bedrooms ? (
                              <FormHelperText>{errors.bedrooms.message}</FormHelperText>
                            ) : null}
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
                            <OutlinedInput {...field} />
                            {errors.bathrooms ? (
                              <FormHelperText>{errors.bathrooms.message}</FormHelperText>
                            ) : null}
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
                            <OutlinedInput
                              {...field}
                              inputProps={{ min: 1, max: 8 }}
                              type="number"
                            />
                            {errors.beds ? (
                              <FormHelperText>{errors.beds.message}</FormHelperText>
                            ) : null}
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid md={6} xs={12}>
                      <Controller
                        control={control}
                        name="userId"
                        render={({ field }) => (
                          <Autocomplete
                            {...field}
                            getOptionLabel={(option: Customer) =>
                              option.firstname && option.lastname
                                ? `${option.firstname} ${option.lastname}`
                                : ''
                            }
                            isOptionEqualToValue={(option: Customer, value: Customer) =>
                              option.id === value.id
                            }
                            loading={usersLoading}
                            onChange={(_, newValue) => { field.onChange(newValue?.id); }}
                            options={users}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                error={field.value === null}
                                helperText={field.value === null ? t('ownerRequired') : null}
                                label={t('owner')}
                              />
                            )}
                            value={users.find((user: Customer) => user.id === field.value) || null}
                          />
                        )}
                      />
                    </Grid>
                    <Grid xs={12}>
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
                            {errors.description ? (
                              <FormHelperText error>{errors.description.message}</FormHelperText>
                            ) : null}
                          </FormControl>
                        )}
                      />
                    </Grid>
                  </Grid>
                </Stack>
                <Stack spacing={3}>
                  <Typography variant="h6">{t('Facilities')}</Typography>
                  <Grid container spacing={3}>
                    {!facilitiesLoading
                      ? facilities.map((facility: { id: number; name: string }) => (
                          <Grid key={facility.id} md={6} xs={12}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  onChange={() => {
                                    if (selectedFacilities.includes(facility.id)) {
                                      setSelectedFacilities(() =>
                                        selectedFacilities.filter((id) => id !== facility.id)
                                      );
                                    } else {
                                      setSelectedFacilities(() => [
                                        ...selectedFacilities,
                                        facility.id,
                                      ]);
                                    }
                                  }}
                                />
                              }
                              label={facility.name}
                            />
                          </Grid>
                        ))
                      : null}
                  </Grid>
                </Stack>
                <Stack spacing={3}>
                  <Typography variant="h6">{t('images')}</Typography>
                  <Card sx={{ borderRadius: 1 }} variant="outlined">
                    <DataTable<Image>
                      columns={getImageColumns({ onRemove: handleImageRemove })}
                      rows={images}
                    />
                    {images.length === 0 ? (
                      <Box sx={{ p: 1 }}>
                        <Typography align="center" color="text.secondary" variant="body2">
                          {t('noImages')}
                        </Typography>
                      </Box>
                    ) : null}
                  </Card>
                  <FileDropzone
                    accept={{ 'image/*': [] }}
                    caption={t('imageFormats')}
                    onDrop={handleImageDrop}
                  />
                </Stack>
              </Stack>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Button
                color="secondary"
                component={RouterLink}
                href={paths.dashboard.properties.list}
              >
                {t('cancel')}
              </Button>
              <Button type="submit" variant="contained">
                {t('createProperty')}
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid md={4} xs={12}>
          <Stack spacing={3}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6">{t('preview')}</Typography>
                  {images.length > 0 ? (
                    <Box
                      sx={{
                        display: 'flex',
                        overflowX: 'auto',
                        '& > *': {
                          flex: '0 0 auto',
                          marginRight: 2,
                        },
                      }}
                    >
                      {images.map((image) => (
                        <Box
                          key={image.id}
                          sx={{
                            backgroundImage: `url(${image.url})`,
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                            borderRadius: 1,
                            height: '100px',
                            width: '100px',
                          }}
                        />
                      ))}
                    </Box>
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
                  <Typography color="text.primary" variant="subtitle1">
                    {title || t('titleNotSpecified')}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {propertyType || t('propertyTypeNotSpecified')}
                  </Typography>
                  <Stack spacing={2}>
                    <Typography color="text.secondary" variant="body2">
                      {line1 && zipCode && city && country ? (
                        <>
                          {line1}
                          <br />
                          {zipCode} {city},
                          <br />
                          {state ? (
                            <>
                              {state}
                              <br />
                            </>
                          ) : null}{' '}
                          {country}
                        </>
                      ) : (
                        t('addressNotSpecified')
                      )}
                    </Typography>
                  </Stack>
                  <Typography color="text.secondary" variant="body2">
                    {bedrooms ? `${bedrooms} ${t('bedrooms')}` : t('bedroomsNotSpecified')}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {bathrooms ? `${bathrooms} ${t('bathrooms')}` : t('bathroomsNotSpecified')}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {beds ? `${beds} ${t('beds')}` : t('bedsNotSpecified')}
                  </Typography>
                  <Typography color="text.primary" variant="body2">
                    ${price || 0} / {t('night')}
                  </Typography>
                  <Typography color="text.primary" variant="body2">
                    {t('description')}:
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {description || t('noDescriptionProvided')}
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

