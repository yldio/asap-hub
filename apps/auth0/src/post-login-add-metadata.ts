import type { gp2 as gp2Auth, User } from '@asap-hub/auth';
import type {
  gp2 as gp2Model,
  UserMetadataResponse,
  UserTeam,
} from '@asap-hub/model';
import { Auth0PostLoginApi } from '@vedicium/auth0-actions-sdk';
import got from 'got';
import { URL, URLSearchParams } from 'url';
import { Auth0PostLoginEventWithSecrets } from './types';

type Auth0UserResponse = UserMetadataResponse | gp2Model.UserMetadataResponse;

const isUserMetadataResponse = (
  response: UserMetadataResponse | gp2Model.UserMetadataResponse,
): response is UserMetadataResponse => 'teams' in response;

const parseCommonUserMetadata = ({
  id,
  email,
  algoliaApiKey,
  displayName,
  firstName,
  lastName,
  avatarUrl,
  onboarded,
}: Auth0UserResponse) => ({
  id,
  email,
  algoliaApiKey,
  displayName,
  firstName,
  lastName,
  avatarUrl,
  onboarded,
});
const parseGP2UserMetadata = ({
  role,
  workingGroups,
  projects,
}: gp2Model.UserMetadataResponse) => ({
  role,
  workingGroups,
  projects,
});
const parseTeam = ({ id, displayName, role, inactiveSinceDate }: UserTeam) => ({
  id,
  displayName,
  role,
  inactiveSinceDate,
});
const parseUserMetadata = ({
  teams,
  workingGroups,
  interestGroups,
  role,
}: UserMetadataResponse) => ({
  teams: teams.map(parseTeam),
  workingGroups,
  interestGroups,
  role,
});
const extractUser = (response: Auth0UserResponse): User | gp2Auth.User => ({
  ...parseCommonUserMetadata(response),
  ...(isUserMetadataResponse(response)
    ? parseUserMetadata(response)
    : parseGP2UserMetadata(response)),
});

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
    `https://(?<pr_number>[0-9]+).${
      event.secrets.BASE_PR_APP_DOMAIN ?? '##BASE_PR_APP_DOMAIN##'
    }`,
  );
  const matches = prUrlRegex.exec(redirect_uri);
  return [
    matches?.groups?.pr_number
      ? `https://api-${matches.groups.pr_number}.${
          event.secrets.BASE_PR_APP_DOMAIN ?? '##BASE_PR_APP_DOMAIN##'
        }`
      : event.secrets.API_URL ?? '##API_URL##',
    redirect_uri,
  ];
};

export const onExecutePostLogin = async (
  event: Auth0PostLoginEventWithSecrets,
  api: Auth0PostLoginApi,
) => {
  try {
    const [apiUrl, redirect_uri] = getApiUrls(event);
    const response = await got(
      `${apiUrl}/webhook/users/${event.user.user_id}`,
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
    const errorMessage =
      err instanceof Error ? err.message : 'Unexpected Error';

    return api.access.deny(errorMessage);
  }
  return true;
};
