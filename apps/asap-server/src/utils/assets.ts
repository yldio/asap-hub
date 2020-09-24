import { URL } from 'url';
import { cms } from '../config';

export const createURL = (assets: string[]): string[] => {
  return assets.map((asset) =>
    new URL(`/api/assets/${cms.appName}/${asset}`, cms.baseUrl).toString(),
  );
};
