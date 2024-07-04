export type EventPriority = 'low' | 'medium' | 'high';

export interface Event {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay: boolean;
  priority?: EventPriority;
  type: 'reservation' | 'facility' | 'common';
}

export type ViewMode = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';
