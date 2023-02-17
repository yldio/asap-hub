import { Auth0PostLoginApi } from '@vedicium/auth0-actions-sdk';
import type { gp2 as gp2Auth, User } from '@asap-hub/auth';
import type { gp2 as gp2Model, UserMetadataResponse } from '@asap-hub/model';
import got from 'got';
import { URL, URLSearchParams } from 'url';
import { Auth0PostLoginEventWithSecrets } from './types';

type Auth0UserResponse = UserMetadataResponse | gp2Model.UserResponse;

const isUserMetadataResponse = (
  response: UserMetadataResponse | gp2Model.UserResponse,
): response is UserMetadataResponse => 'algoliaApiKey' in response;

const extractUser = (response: Auth0UserResponse): User | gp2Auth.User => {
  if (isUserMetadataResponse(response)) {
    const {
      id,
      onboarded,
      displayName,
      email,
      firstName,
      lastName,
      avatarUrl,
      teams,
      algoliaApiKey,
      workingGroups,
    } = response;

    return {
      id,
      onboarded,
      displayName,
      email,
      firstName,
      lastName,
      avatarUrl,
      teams: teams.map((team) => ({
        id: team.id,
        displayName: team.displayName,
        role: team.role,
        inactiveSinceDate: team.inactiveSinceDate,
      })),
      algoliaApiKey,
      workingGroups,
    };
  }
  const {
    id,
    email,
    displayName,
    firstName,
    lastName,
    avatarUrl,
    onboarded,
    role,
  } = response;

  return {
    id,
    displayName,
    email,
    firstName,
    lastName,
    avatarUrl,
    onboarded,
    role,
  };
};

export const onExecutePostLogin = async (
  event: Auth0PostLoginEventWithSecrets,
  api: Auth0PostLoginApi,
) => {
  const redirect_uri = new URLSearchParams(event.request.query).get(
    'redirect_uri',
  )
    ? new URLSearchParams(event.request.query).get('redirect_uri')
    : event.request.body.redirect_uri;
  if (!redirect_uri) {
    return api.access.deny('Missing redirect_uri');
  }

  const prUrlRegex = new RegExp(
    `https://(?<pr_number>[0-9]+).${event.secrets.PR_APP_DOMAIN}`,
  );
  const matches = prUrlRegex.exec(redirect_uri);
  const apiURL = matches?.groups?.pr_number
    ? `https://api-${matches.groups.pr_number}.${event.secrets.PR_APP_DOMAIN}`
    : event.secrets.ASAP_API_URL;
  try {
    const response = await got(
      `${apiURL}/webhook/users/${event.user.user_id}`,
      {
        headers: {
          Authorization: `Basic ${event.secrets.AUTH0_SHARED_SECRET}`,
        },
        timeout: 10000,
      },
    ).json<Auth0UserResponse>();
    if (isUserMetadataResponse(response) && response.alumniSinceDate) {
      return api.access.deny('alumni-user-access-denied');
    }
    const user = extractUser(response);
    api.idToken.setCustomClaim(new URL('/user', redirect_uri).toString(), user);
    if (event.secrets.AUTH0_ADDITIONAL_CLAIM_DOMAIN) {
      api.idToken.setCustomClaim(
        new URL(
          '/user',
          event.secrets.AUTH0_ADDITIONAL_CLAIM_DOMAIN,
        ).toString(),
        user,
      );
    }
  } catch (err) {
    let errorMessage;
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    return api.access.deny(errorMessage ?? 'Unexpected Error');
  }
  return true;
};
