import { URL } from 'url';
import { format } from 'date-fns';
import { config } from '@asap-hub/squidex';

export const createURL = (assets: string[]): string[] => {
  return assets.map((asset) =>
    new URL(
      `/api/assets/${config.appName}/${asset}`,
      config.baseUrl,
    ).toString(),
  );
};

export const parseDate = (date: string): Date => {
  return new Date(date);
};

export const formatDate = (date: Date): string => {
  return format(date, "yyyy-MM-dd'T'HH:mm:ssX");
};
