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
import { Camera as CameraIcon } from '@phosphor-icons/react/dist/ssr/Camera';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { Option } from '@/components/core/option';
import { toast } from '@/components/core/toaster';
import axios, { endpoints } from '@/lib/axios';
import { useGetUsers } from '@/api/users';
import { Autocomplete, TextField } from '@mui/material';
import { Customer } from '@/types/customer';
import { useTranslation } from 'react-i18next';

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
  avatar: zod.string().optional(),
  name: zod.string().min(1, { message: 'nameRequired' }).max(255),
  siren: zod.string().min(9, { message: 'sirenRequired' }).max(9),
  userId: zod.number().int().min(1, { message: 'userIdRequired' }).positive(),
});

type Values = zod.infer<typeof schema>;

export function SocietyCreateForm(): React.JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const { users, usersLoading } = useGetUsers();

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      try {
        const response = await axios.post(endpoints.societies.post, values);

        if (response.data && response.data.id) {
          if (values.avatar) {
            const file = base64ToFile(values.avatar);
            const formData = new FormData();
            formData.append('avatar', file);

            await axios.put(endpoints.societies.avatar.put(response.data.id), formData);
          }

          toast.success(t('societyCreated'));
          return router.push(paths.dashboard.societies.details(response.data.id));
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
              <Typography variant="h6">{t('accountInformation')}</Typography>
              <Grid container spacing={3}>
                <Grid xs={12}>
                  <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
                    <Box
                      sx={{
                        border: '1px dashed var(--mui-palette-divider)',
                        borderRadius: '50%',
                        display: 'inline-flex',
                        p: '4px',
                      }}
                    >
                      <Avatar
                        src={avatar}
                        sx={{
                          '--Avatar-size': '100px',
                          '--Icon-fontSize': 'var(--icon-fontSize-lg)',
                          alignItems: 'center',
                          bgcolor: 'var(--mui-palette-background-level1)',
                          color: 'var(--mui-palette-text-primary)',
                          display: 'flex',
                          justifyContent: 'center',
                        }}
                      >
                        <CameraIcon fontSize="var(--Icon-fontSize)" />
                      </Avatar>
                    </Box>
                    <Stack spacing={1} sx={{ alignItems: 'flex-start' }}>
                      <Typography variant="subtitle1">{t('avatar')}</Typography>
                      <Typography variant="caption">{t('avatarRequirements')}</Typography>
                      <Button
                        color="secondary"
                        onClick={() => {
                          avatarInputRef.current?.click();
                        }}
                        variant="outlined"
                      >
                        {t('select')}
                      </Button>
                      <input
                        hidden
                        onChange={handleAvatarChange}
                        ref={avatarInputRef}
                        type="file"
                      />
                    </Stack>
                  </Stack>
                </Grid>

                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.name)} fullWidth>
                        <InputLabel required>{t('name')}</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.name ? (
                          <FormHelperText>{t(errors.name.message)}</FormHelperText>
                        ) : null}
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="siren"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.siren)} fullWidth>
                        <InputLabel required>{t('sirenNumber')}</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.siren ? (
                          <FormHelperText>{t(errors.siren.message)}</FormHelperText>
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
                        options={users}
                        getOptionLabel={(option: Customer) =>
                          option.firstname && option.lastname
                            ? `${option.firstname} ${option.lastname}`
                            : ''
                        }
                        isOptionEqualToValue={(option: Customer, value: Customer) =>
                          option.id === value.id
                        }
                        value={users.find((user: Customer) => user.id === field.value) || null}
                        onChange={(_, newValue) => field.onChange(newValue?.id)}
                        loading={usersLoading}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={t('owner')}
                            error={field.value === null}
                            helperText={field.value === null ? t('ownerRequired') : null}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Stack>
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button color="secondary" component={RouterLink} href={paths.dashboard.societies.list}>
            {t('cancel')}
          </Button>
          <Button type="submit" variant="contained">
            {t('createSociety')}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}