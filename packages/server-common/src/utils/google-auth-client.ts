import { GoogleAuth, JWT } from 'google-auth-library';
import { GetJWTCredentials } from './aws-secret-manager';

export const getAuthClient = async (getJWTCredentials: GetJWTCredentials) => {
  const creds = await getJWTCredentials();
  return new GoogleAuth({
    scopes: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ],
  }).fromJSON(creds) as JWT;
};
