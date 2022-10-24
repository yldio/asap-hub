import { applyToAllItemsInCollectionFactory } from '@asap-hub/server-common';
import { appName, baseUrl } from '../config';
import { getAuthToken } from './auth';

export const applyToAllItemsInCollection = applyToAllItemsInCollectionFactory(
  appName,
  baseUrl,
  getAuthToken,
);
