import { DateTime } from 'luxon';
import { URL } from 'url';
import { config } from '@asap-hub/squidex';

export const createURL = (assets: string[]): string[] =>
  assets.map((asset) =>
    new URL(
      `/api/assets/${config.appName}/${asset}`,
      config.baseUrl,
    ).toString(),
  );

export const parseDate = (date: string): Date =>
  DateTime.fromISO(date).toJSDate();

export const sanitiseForSquidex = (text: string): string =>
  escape(text.replace(/'/g, "''"));

export const validatePropertiesRequired = <T extends object>(
  object: T,
): object is RequiredAndNonNullable<T> => {
  for (const prop in object) {
    if (typeof object[prop] === 'undefined' || object[prop] === null) {
      return false;
    }
  }

  return true;
};

type RequiredAndNonNullable<T> = Required<
  {
    [Property in keyof T]: NonNullable<T[Property]>;
  }
>;
