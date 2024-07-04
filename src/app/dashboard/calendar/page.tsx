'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useRouter } from 'next/navigation';

import { config } from '@/config';
import { dayjs } from '@/lib/dayjs';
import { CalendarProvider } from '@/components/dashboard/calendar/calendar-context';
import { CalendarView } from '@/components/dashboard/calendar/calendar-view';
import type { Event, ViewMode } from '@/components/dashboard/calendar/types';

const events = [
  {
    id: 'EV-001',
    title: 'HR meeting',
    description: 'Discuss about the new open positions',
    start: dayjs().set('hour', 15).set('minute', 30).toDate(),
    end: dayjs().set('hour', 17).set('minute', 30).toDate(),
    allDay: false,
    priority: 'medium',
    type: 'common',
  },
  {
    id: 'EV-002',
    title: 'Design meeting',
    description: 'Plan the new design for the landing page',
    start: dayjs().subtract(6, 'day').set('hour', 9).set('minute', 0).toDate(),
    end: dayjs().subtract(6, 'day').set('hour', 9).set('minute', 30).toDate(),
    allDay: false,
    priority: 'medium',
    type: 'facility',
  },
  {
    id: 'EV-003',
    title: 'Fire John',
    description: 'Sorry, John!',
    start: dayjs().add(3, 'day').set('hour', 7).set('minute', 30).toDate(),
    end: dayjs().add(3, 'day').set('hour', 7).set('minute', 31).toDate(),
    allDay: false,
    priority: 'high',
    type: 'reservation',
  },
  // Add more events as needed
] satisfies Event[];

interface PageProps {
  searchParams: { view?: ViewMode; mode?: 'all' | 'reservations' | 'facilities' };
}

export default function Page({ searchParams }: PageProps): React.JSX.Element {
  const { view = 'dayGridMonth', mode = 'all' } = searchParams;
  const router = useRouter();

  const filteredEvents = React.useMemo(() => {
    switch (mode) {
      case 'reservations':
        return events.filter(event => event.type === 'reservation');
      case 'facilities':
        return events.filter(event => event.type === 'facility');
      case 'all':
      default:
        return events;
    }
  }, [mode]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    router.push(`?mode=${newValue}`);
  };

  return (
    <Box
      sx={{
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        width: 'var(--Content-width)',
      }}
    >
      <Tabs value={mode} onChange={handleTabChange} aria-label="view mode tabs">
        <Tab label="All" value="all" />
        <Tab label="Reservations" value="reservations" />
        <Tab label="Facilities" value="facilities" />
      </Tabs>
      <CalendarProvider events={filteredEvents}>
        <CalendarView view={view} />
      </CalendarProvider>
    </Box>
  );
}
