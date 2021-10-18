import type { User } from '@asap-hub/auth';
import type { UserMetadataResponse } from '@asap-hub/model';
import { URL, URLSearchParams } from 'url';
import got from 'got';
import type { Rule } from './types';

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

  const prUrlRegex = /https:\/\/(?<pr_number>[0-9]+)\.hub.asap.science/;
  const matches = prUrlRegex.exec(redirect_uri);

  const apiURL = matches?.groups?.pr_number
    ? `https://api-${matches.groups.pr_number}.hub.asap.science`
    : configuration?.APP_ORIGIN;
  const apiSharedSecret = configuration?.API_SHARED_SECRET;

  try {
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
    } = await got(`${apiURL}/webhook/users/${auth0User.user_id}`, {
      headers: {
        Authorization: `Basic ${apiSharedSecret}`,
      },
      timeout: 10000,
    }).json<UserMetadataResponse>();

    const user: User = {
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
    context.idToken[new URL('/user', redirect_uri).toString()] = user;
    // Uncomment for dev auth0. This allows pointing to dev api from local FE
    // context.idToken[new URL('/user', 'https://dev.hub.asap.science').toString()] = user;

    return callback(null, auth0User, context);
  } catch (err) {
    return callback(new Error(err));
  }
};

export default addUserMetadata;
