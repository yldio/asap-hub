import { DateTime } from 'luxon';
import { URL } from 'url';
import { SquidexConfig } from './auth';

export const createUrlFactory =
  (config: Pick<SquidexConfig, 'appName' | 'baseUrl'>) =>
  (assets: string[]): string[] =>
    assets.map((asset) =>
      new URL(
        `/api/assets/${config.appName}/${asset}`,
        config.baseUrl,
      ).toString(),
    );

export const parseDate = (date: string): Date =>
  DateTime.fromISO(date).toJSDate();

export const sanitiseForSquidex = (text: string): string =>
  text
    .replace(/'/g, '%27%27')
    .replace(/"/g, '%22')
    .replace(/\+/g, '%2B')
    .replace(/\//g, '%2F')
    .replace(/\?/g, '%3F')
    .replace(/#/g, '%23')
    .replace(/&/g, '%26');

export type RequiredAndNonNullable<T> = Required<{
  [Property in keyof T]: NonNullable<T[Property]>;
}>;

type NoUndefined<T> = T extends undefined ? never : T;

type SquidexEntityObject<DataObject> = {
  [Property in keyof DataObject]: DataObject[Property] extends undefined
    ? undefined
    : { iv: NoUndefined<DataObject[Property]> };
};

export const parseToSquidex = <T extends object>(
  object: T,
): SquidexEntityObject<T> =>
  Object.entries(object).reduce(
    (acc, [key, value]) =>
      typeof value === 'undefined'
        ? acc
        : {
            ...acc,
            [key]: { iv: value },
          },
    {} as SquidexEntityObject<T>,
  );
