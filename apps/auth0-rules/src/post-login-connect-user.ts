import { Auth0PostLoginApi } from '@vedicium/auth0-actions-sdk';
import got from 'got';
import type { Auth0PostLoginEventWithSecrets } from './types';

export const onExecutePostLogin = async (
  event: Auth0PostLoginEventWithSecrets,
  api: Auth0PostLoginApi,
) => {
  const invitationCode = new URLSearchParams(event.request.query).get(
    'invitation_code',
  );

  if (invitationCode) {
    try {
      await got
        .post(`${event.secrets.ASAP_API_URL}/webhook/users/connections`, {
          json: {
            code: invitationCode,
            userId: event.user.user_id,
          },
          headers: {
            Authorization: `Basic ${event.secrets.AUTH0_SHARED_SECRET}`,
          },
          timeout: 10000,
        })
        .json();
    } catch (err) {
      let errorMessage;
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      return api.access.deny(errorMessage ?? 'Unexpected Error');
    }
  }
  return true;
};

export default onExecutePostLogin;
