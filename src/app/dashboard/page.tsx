'use client'

import * as React from 'react';
import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { Briefcase as BriefcaseIcon } from '@phosphor-icons/react/dist/ssr/Briefcase';
import { FileCode as FileCodeIcon } from '@phosphor-icons/react/dist/ssr/FileCode';
import { Info as InfoIcon } from '@phosphor-icons/react/dist/ssr/Info';
import { ListChecks as ListChecksIcon } from '@phosphor-icons/react/dist/ssr/ListChecks';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { Warning as WarningIcon } from '@phosphor-icons/react/dist/ssr/Warning';

import { config } from '@/config';
import { dayjs } from '@/lib/dayjs';
import { AppChat } from '@/components/dashboard/overview/app-chat';
import { AppLimits } from '@/components/dashboard/overview/app-limits';
import { AppUsage } from '@/components/dashboard/overview/app-usage';
import { Events } from '@/components/dashboard/overview/events';
import { HelperWidget } from '@/components/dashboard/overview/helper-widget';
import { Subscriptions } from '@/components/dashboard/overview/subscriptions';
import { Summary } from '@/components/dashboard/overview/summary';
import { CurrentBalance } from '@/components/dashboard/crypto/current-balance';
import { useTranslation } from 'react-i18next';



// export const metadata = { title: `overview | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  const { i18n, t } = useTranslation();
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
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">{t('overview')}</Typography>
          </Box>
          <div>
            <Button startIcon={<PlusIcon />} variant="contained">
              {t('dashboard')}
            </Button>
          </div>
        </Stack>
        <Grid container spacing={4}>
          <Grid md={4} xs={12}>
            <Summary amount={321} diff={15} icon={ListChecksIcon} title={t('orderCount')} trend="up" />
          </Grid>
          <Grid md={4} xs={12}>
            <Summary amount={201} diff={30} icon={ListChecksIcon} title={t('orderCount')} trend="up" />
          </Grid>
          <Grid md={4} xs={12}>
            <Summary amount={240} diff={5} icon={UsersIcon} title={t('registration')} trend="up" />
          </Grid>
          <Grid md={4} xs={12}>
            <Summary amount={21} diff={2} icon={WarningIcon} title={t('report')} trend="down" />
          </Grid>
          <Grid md={4} xs={12}>
            <Subscriptions
              subscriptions={[
                {
                  id: 'VIP-bailleur',
                  title: 'VIP-bailleur',
                  icon: '/assets/company-avatar-5.png',
                  costs: '$5999',
                  billingCycle: 'year',
                  status: 'paid',
                },
                {
                  id: 'VIP-voyageur',
                  title: 'VIP-voyageur',
                  icon: '/assets/company-avatar-4.png',
                  costs: '$3999',
                  billingCycle: 'month',
                  status: 'expiring',
                },
              ]}
            />
          </Grid>
          <Grid md={4} xs={12}>
            <CurrentBalance
              data={[
                { name: 'USD', value: 10076.81, color: 'var(--mui-palette-success-main)' },
                { name: 'BTC', value: 16213.2, color: 'var(--mui-palette-warning-main)' },
                { name: 'ETH', value: 9626.8, color: 'var(--mui-palette-primary-main)' },
              ]}
            />
          </Grid>
          <Grid md={8} xs={12}>
          <AppUsage
              data={[
                { name: 'Jan', v1: 36, v2: 19 },
                { name: 'Feb', v1: 45, v2: 23 },
                { name: 'Mar', v1: 26, v2: 12 },
                { name: 'Apr', v1: 39, v2: 20 },
                { name: 'May', v1: 26, v2: 12 },
                { name: 'Jun', v1: 42, v2: 31 },
                { name: 'Jul', v1: 38, v2: 19 },
                { name: 'Aug', v1: 39, v2: 20 },
                { name: 'Sep', v1: 37, v2: 18 },
                { name: 'Oct', v1: 41, v2: 22 },
                { name: 'Nov', v1: 45, v2: 24 },
                { name: 'Dec', v1: 23, v2: 17 },
              ]}
            />
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}
