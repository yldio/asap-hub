import { format, utcToZonedTime } from 'date-fns-tz';

import { getLocalTimezone } from './localization';

export const formatDate = (date: Date): string => format(date, 'do MMMM yyyy');
export const formatDateAndTime = (date: Date): string =>
  format(date, "d/M/y 'at' HH:mm");

export const formatDateToTimezone = (
  date: string,
  form: string,
  tz = getLocalTimezone(),
): string => {
  const zonedDate = utcToZonedTime(date, tz);
  return format(zonedDate, form, { timeZone: tz });
};
