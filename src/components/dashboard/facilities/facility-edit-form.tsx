import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/components/core/toaster';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().min(1, 'Description is required').max(255),
});

type FormValues = z.infer<typeof schema>;

interface FacilityEditFormProps {
  facility: {
    id: string;
    name: string;
    description: string;
  };
}

export const FacilityEditForm: React.FC<FacilityEditFormProps> = ({ facility }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: facility,
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await axiosInstance.put(`/facilities/${facility.id}`, data);
      toast.success(t('facilityUpdated'));
      router.push('/dashboard/facilities');
    } catch (error) {
      console.error('Failed to update facility', error);
      toast.error(t('somethingWentWrong'));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Typography variant="h6">{t('editFacility')}</Typography>
            <Divider />
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('name')}
                  error={!!errors.name}
                  helperText={errors.name ? errors.name.message : ''}
                  fullWidth
                />
              )}
            />
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('description')}
                  error={!!errors.description}
                  helperText={errors.description ? errors.description.message : ''}
                  fullWidth
                />
              )}
            />
            <Button type="submit" variant="contained" color="primary">
              {t('update')}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </form>
  );
};
