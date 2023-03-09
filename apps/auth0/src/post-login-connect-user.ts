import { Auth0PostLoginApi } from '@vedicium/auth0-actions-sdk';
import got from 'got';
import type { Auth0PostLoginEventWithSecrets } from './types';
// ##API_URL##'

const getApiUrls = (event: Auth0PostLoginEventWithSecrets) => {
  const redirect_uri = new URLSearchParams(event.request.query).get(
    'redirect_uri',
  )
    ? new URLSearchParams(event.request.query).get('redirect_uri')
    : event.request.body.redirect_uri;
  if (!redirect_uri) {
    throw new Error('Missing redirect_uri');
  }
  const prUrlRegex = new RegExp(
    `https://(?<pr_number>[0-9]+).${event.secrets.BASE_PR_APP_DOMAIN}`,
  );
  const matches = prUrlRegex.exec(redirect_uri);
  return [
    matches?.groups?.pr_number
      ? `https://api-${matches.groups.pr_number}.${event.secrets.BASE_PR_APP_DOMAIN}`
      : event.secrets.API_URL,
    redirect_uri,
  ];
};

export const onExecutePostLogin = async (
  event: Auth0PostLoginEventWithSecrets,
  api: Auth0PostLoginApi,
) => {
  const invitationCode = new URLSearchParams(event.request.query).get(
    'invitation_code',
  );

  if (invitationCode) {
    try {
      const [apiUrl] = getApiUrls(event);
      await got
        .post(`${apiUrl}/webhook/users/connections`, {
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
