'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Camera as CameraIcon } from '@phosphor-icons/react/dist/ssr/Camera';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { z as zod } from 'zod';

import { useUser } from '@/hooks/use-user';

import { useDropzone } from 'react-dropzone';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { endpoints } from '@/lib/axios';

const schema = zod.object({
  firstname: zod.string().min(1, { message: 'Firstname is required' }),
  lastname: zod.string().min(1, { message: 'Lastname is required' }),
});

type Values = zod.infer<typeof schema>;

export function AccountDetails(): React.JSX.Element {
  const { user } = useUser();

  const defaultValues = {
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
  } satisfies Values;

  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(user?.avatar || null);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);
      setIsPending(false);
    },
    [setError]
  );

  const onDrop = React.useCallback((acceptedFiles: any[]) => {
    const file = acceptedFiles[0];

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader
          avatar={
            <Avatar>
              <UserIcon fontSize="var(--Icon-fontSize)" />
            </Avatar>
          }
          title="Basic details"
        />
        <CardContent>
          <Stack spacing={3}>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <Box
                sx={{
                  border: '1px dashed var(--mui-palette-divider)',
                  borderRadius: '50%',
                  display: 'inline-flex',
                  p: '4px',
                }}
              >
                <Box sx={{ borderRadius: 'inherit', position: 'relative' }} {...getRootProps()}>
                  <Box
                    sx={{
                      alignItems: 'center',
                      bgcolor: 'rgba(0, 0, 0, 0.5)',
                      borderRadius: 'inherit',
                      bottom: 0,
                      color: 'var(--mui-palette-common-white)',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'center',
                      left: 0,
                      opacity: 0,
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      zIndex: 1,
                      '&:hover': { opacity: 1 },
                    }}
                  >
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                      <CameraIcon fontSize="var(--icon-fontSize-md)" />
                      <Typography color="inherit" variant="subtitle2">
                        Select
                      </Typography>
                    </Stack>
                  </Box>
                  <Avatar
                    src={undefined}
                    sx={{ '--Avatar-size': '100px' }}
                  >
                    <input {...getInputProps()} />
                  </Avatar>
                </Box>
              </Box>
              <Button color="secondary" size="small">
                Remove
              </Button>
            </Stack>
            <Stack spacing={2}>
              <Controller
                control={control}
                name="firstname"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.firstname)}>
                    <InputLabel>Firstname</InputLabel>
                    <OutlinedInput {...field} />
                    {errors.firstname ? (
                      <FormHelperText>{errors.firstname.message}</FormHelperText>
                    ) : null}
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="lastname"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.lastname)}>
                    <InputLabel>Lastname</InputLabel>
                    <OutlinedInput {...field} />
                    {errors.lastname ? (
                      <FormHelperText>{errors.lastname.message}</FormHelperText>
                    ) : null}
                  </FormControl>
                )}
              />
              <FormControl disabled>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput name="email" type="email" value={user?.email} />
                <FormHelperText>
                  Please{' '}
                  <Link href="mailto:contact@projet_annuel.fr" variant="inherit">
                    contact us
                  </Link>{' '}
                  to change your email
                </FormHelperText>
              </FormControl>
            </Stack>
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button color="secondary">Cancel</Button>
          <Button disabled={isPending} type="submit" variant="contained">
            Save changes
          </Button>
        </CardActions>
      </form>
    </Card>
  );
}
