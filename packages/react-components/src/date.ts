import { format, utcToZonedTime } from 'date-fns-tz';

import { getLocalTimezone } from './localization';

export const formatDate = (date: Date): string => format(date, 'do MMMM yyyy');
export const formatDateAndTime = (date: Date): string =>
  format(date, "d/M/y 'at' HH:mm");

export const formatDateToLocalTimezone = (
  date: string,
  form: string,
): string => {
  const zonedDate = utcToZonedTime(date, getLocalTimezone());
  return format(zonedDate, form, {
    timeZone: getLocalTimezone(),
  });
};
