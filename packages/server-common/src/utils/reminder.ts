import { DateTime } from 'luxon';

export const getReferenceDates = (zone: string) => {
  const lastMidnightISO = DateTime.fromObject({
    zone,
  })
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    .toUTC();

  const todayMidnightISO = DateTime.fromObject({
    zone,
  })
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    .plus({ day: 1 })
    .toUTC();

  const last24HoursISO = DateTime.fromObject({
    zone,
  })
    .minus({ hours: 24 })
    .toUTC();

  const last72HoursISO = DateTime.fromObject({
    zone,
  })
    .minus({ hours: 72 })
    .toUTC();

  const now = DateTime.fromObject({
    zone,
  }).toUTC();

  return {
    lastMidnightISO,
    todayMidnightISO,
    last24HoursISO,
    last72HoursISO,
    now,
  };
};

export const convertDate = (date: string, zone: string) =>
  DateTime.fromISO(date, { zone }).toUTC();

export const inLast24Hours = (date: string, zone: string) => {
  const convertedDate = convertDate(date, zone);
  const { last24HoursISO, now } = getReferenceDates(zone);

  return convertedDate >= last24HoursISO && convertedDate <= now;
};

export const cleanArray = <Item>(
  items: Array<Item | null> | undefined,
): Array<Item> =>
  (items || []).filter((item: Item | null): item is Item => item !== null);

export const filterUndefined = (arr: (string | undefined)[]): string[] =>
  arr.filter((value) => value !== undefined) as string[];

export const getUserName = <
  T extends
    | {
        createdBy?: {
          firstName?: string | null;
          lastName?: string | null;
        } | null;
      }
    | null
    | undefined,
>(
  researchOutput: T,
) => {
  if (
    researchOutput &&
    researchOutput.createdBy &&
    researchOutput.createdBy.firstName &&
    researchOutput.createdBy.lastName
  ) {
    const { firstName, lastName } = researchOutput.createdBy;
    return `${firstName} ${lastName}`;
  }
  return null;
};
