import { URL } from 'url';
import { parse, format } from 'date-fns';
import { cms } from '../config';

export const createURL = (assets: string[]): string[] => {
  return assets.map((asset) =>
    new URL(`/api/assets/${cms.appName}/${asset}`, cms.baseUrl).toString(),
  );
};

export const parseDate = (date: string): Date => {
  return parse(date, "yyyy-MM-dd'T'HH:mm:ssX", 0);
};

export const formatDate = (date: Date): string => {
  return format(date, "yyyy-MM-dd'T'HH:mm:ssX");
};
