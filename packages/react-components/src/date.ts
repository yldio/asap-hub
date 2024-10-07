import { useState, useEffect } from 'react';
import { format, utcToZonedTime } from 'date-fns-tz';

import { getLocalTimezone } from './localization';

export const formatDate = (date: Date): string => format(date, 'do MMMM yyyy');
export const formatDateAndWeekday = (date: Date): string =>
  format(date, 'EEE, do MMMM yyyy');

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

const UPDATE_INTERVAL_SECONDS = 10;
export const useDateHasPassed = (date: string | Date): boolean => {
  const [hasPassed, setPassed] = useState(new Date() > new Date(date));
  useEffect(() => {
    const updateInterval = globalThis.setInterval(() => {
      setPassed(new Date() > new Date(date));
    }, UPDATE_INTERVAL_SECONDS * 1000);
    return () => globalThis.clearInterval(updateInterval);
  }, [date]);
  return hasPassed;
};
