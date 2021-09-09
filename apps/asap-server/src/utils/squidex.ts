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

export const validatePropertiesRequired = <
  T extends { [key: string]: unknown },
>(
  entity: T,
): entity is RequiredAndNonNullable<T> => {
  const keys = Object.keys(entity);

  for (const prop of keys) {
    if (typeof entity[prop] === 'undefined' || entity[prop] === null) {
      return false;
    }
  }

  return true;
};

export type RequiredAndNonNullable<T> = Required<
  {
    [Property in keyof T]: NonNullable<T[Property]>;
  }
>;
