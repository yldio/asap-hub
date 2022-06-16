import { getAccessTokenFactory } from '@asap-hub/squidex';
import { baseUrl, clientId, clientSecret } from '../config';

export const getAuthToken = getAccessTokenFactory({
  clientId,
  clientSecret,
  baseUrl,
});
