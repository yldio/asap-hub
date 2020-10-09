import { URL } from 'url';
import { format } from 'date-fns';
import { cms } from '../config';

export const createURL = (assets: string[]): string[] => {
  return assets.map((asset) =>
    new URL(`/api/assets/${cms.appName}/${asset}`, cms.baseUrl).toString(),
  );
};

export const parseDate = (date: string): Date => {
  return new Date(date);
};

export const formatDate = (date: Date): string => {
  return format(date, "yyyy-MM-dd'T'HH:mm:ssX");
};
