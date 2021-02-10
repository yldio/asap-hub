import { URL } from 'url';
import { format } from 'date-fns';
import { config } from '@asap-hub/squidex';

export const createURL = (assets: string[]): string[] =>
  assets.map((asset) =>
    new URL(
      `/api/assets/${config.appName}/${asset}`,
      config.baseUrl,
    ).toString(),
  );

export const parseDate = (date: string): Date => new Date(date);

export const formatDate = (date: Date): string =>
  format(date, "yyyy-MM-dd'T'HH:mm:ssX");

export const isNull = (prop: string | null | undefined): boolean =>
  prop === null || prop === 'null';
