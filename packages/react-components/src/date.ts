import { format, toDate } from 'date-fns-tz';
import { enUS } from 'date-fns/locale';

import { getLocalTimezone } from './localization';

export const formatDate = (date: Date): string => format(date, 'do MMMM yyyy');
export const formatDateAndTime = (date: Date): string =>
  format(date, "d/M/y 'at' HH:mm");

export const formatTimezoneToLocalTimezone = (
  date: string,
  form: string,
): string => {
  const parsedDate = toDate(
    date,
    { timeZone: 'Etc/UTC' }, // Default if no timezone is provided in date
  );
  return format(parsedDate, form, {
    timeZone: getLocalTimezone(),
    locale: enUS,
  });
};
