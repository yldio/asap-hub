import { createUrlFactory } from '@asap-hub/squidex';
import { appName, baseUrl } from '../config';

export const createUrl = createUrlFactory({ appName, baseUrl });
