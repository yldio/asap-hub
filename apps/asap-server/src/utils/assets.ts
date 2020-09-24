import { cms } from '../config';

export const createURL = (assets: string[]): string | undefined => {
  if (assets.length === 0) {
    return undefined;
  }

  const asset = assets[0];
  return `${cms.baseUrl}/api/assets/${cms.appName}/${asset}`;
};
