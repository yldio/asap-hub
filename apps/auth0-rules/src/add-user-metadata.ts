import type { User } from '@asap-hub/auth';
import type { gp2, UserMetadataResponse } from '@asap-hub/model';
import got from 'got';
import { URL, URLSearchParams } from 'url';
import type { Rule } from './types';

type Auth0UserResponse = UserMetadataResponse | gp2.UserResponse;

const isUserResponse = (
  response: UserMetadataResponse | gp2.UserResponse,
): response is UserMetadataResponse => 'onboarded' in response;

const handleError = (err: unknown): Error => {
  if (err instanceof Error) {
    return err;
  }
  return new Error('Unexpected Error');
};

const extractUser = (response: Auth0UserResponse): User => {
  if (isUserResponse(response)) {
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
      })),
      algoliaApiKey,
    };
  }
  const { id, email, displayName, firstName, lastName, avatarUrl } = response;

  return {
    id,
    displayName,
    email,
    firstName,
    lastName,
    avatarUrl,
    teams: [],
    onboarded: true,
    algoliaApiKey: '',
  };
};

const addUserMetadata: Rule<{ invitationCode: string }> = async (
  auth0User,
  context,
  callback,
) => {
  const redirect_uri = new URLSearchParams(context.request.query).get(
    'redirect_uri',
  )
    ? new URLSearchParams(context.request.query).get('redirect_uri')
    : context.request.body.redirect_uri;
  if (!redirect_uri) {
    return callback(new Error('Missing redirect_uri'));
  }

  const prUrlRegex = new RegExp(
    `https://(?<pr_number>[0-9]+).${configuration.APP_DOMAIN}`,
  );
  const matches = prUrlRegex.exec(redirect_uri);

  const apiURL = matches?.groups?.pr_number
    ? `https://api-${matches.groups.pr_number}.${configuration.APP_DOMAIN}`
    : configuration?.APP_ORIGIN;
  const apiSharedSecret = configuration?.API_SHARED_SECRET;

  try {
    const response = await got(`${apiURL}/webhook/users/${auth0User.user_id}`, {
      headers: {
        Authorization: `Basic ${apiSharedSecret}`,
      },
      timeout: 10000,
    }).json<Auth0UserResponse>();

    if (isUserResponse(response) && response.alumniSinceDate) {
      return callback(new UnauthorizedError('alumni-user-access-denied'));
    }

    const user: User = extractUser(response);

    context.idToken[new URL('/user', redirect_uri).toString()] = user;
    // Uncomment for dev auth0. This allows pointing to dev api from local FE
    // context.idToken[new URL('/user', 'https://dev.hub.asap.science').toString()] = user;

    return callback(null, auth0User, context);
  } catch (err) {
    const error = handleError(err);
    return callback(error);
  }
};

export default addUserMetadata;
