import { EVENT_CONSIDERED_PAST_HOURS_AFTER_EVENT } from '@asap-hub/model';
import { parseISO, addHours } from 'date-fns';

export function considerEndedAfter(endDate: string): Date {
  return addHours(parseISO(endDate), EVENT_CONSIDERED_PAST_HOURS_AFTER_EVENT);
}
