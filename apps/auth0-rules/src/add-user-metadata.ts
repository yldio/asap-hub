import type { Rule } from '@asap-hub/auth0-rule';
import type { User } from '@asap-hub/auth';
import type { UserResponse } from '@asap-hub/model';
import { URL, URLSearchParams } from 'url';
import got from 'got';

const addUserMetadata: Rule<{ invitationCode: string }> = async (
  auth0User,
  context,
  callback,
) => {
  const apiURL = configuration?.APP_ORIGIN;
  const apiSharedSecret = configuration?.API_SHARED_SECRET;

  const redirect_uri = new URLSearchParams(context.request.query).get(
    'redirect_uri',
  );
  if (!redirect_uri) {
    return callback(new Error('Missing redirect_uri'));
  }

  try {
    const {
      id,
      displayName,
      email,
      firstName,
      lastName,
      avatarURL,
      teams,
    } = await got(`${apiURL}/webhook/users/${auth0User.user_id}`, {
      headers: {
        Authorization: `Basic ${apiSharedSecret}`,
      },
      timeout: 10000,
    }).json<UserResponse>();

    const user: User = {
      id,
      displayName,
      email,
      firstName,
      lastName,
      avatarURL,
      teams: teams.map((team) => ({
        id: team.id,
        displayName: team.displayName,
      })),
    };
    context.idToken[new URL('/user', redirect_uri).toString()] = user;

    return callback(null, auth0User, context);
  } catch (err) {
    return callback(new Error(err));
  }
};

export default addUserMetadata;
