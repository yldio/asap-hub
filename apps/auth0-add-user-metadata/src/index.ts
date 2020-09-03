import type { Rule } from '@asap-hub/auth0-rule';
import type { UserResponse } from '@asap-hub/model';
import got from 'got';

const addUserMetadata: Rule<{ invitationCode: string }> = async (
  user,
  context,
  callback,
) => {
  const apiURL = configuration?.APP_ORIGIN;
  const apiSharedSecret = configuration?.API_SHARED_SECRET;
  try {
    const {
      id,
      displayName,
      email,
      firstName,
      lastName,
      avatarURL,
    } = await got<UserResponse>(`${apiURL}/webhook/users/${user.user_id}`, {
      headers: {
        Authorization: `Basic ${apiSharedSecret}`,
      },
      timeout: 10000,
    }).json();

    context.idToken[`${apiURL}/user`] = {
      id,
      displayName,
      email,
      firstName,
      lastName,
      avatarURL,
    };

    return callback(null, user, context);
  } catch (err) {
    return callback(new Error(err));
  }
};

export default addUserMetadata;
