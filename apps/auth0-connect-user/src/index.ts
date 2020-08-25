import type { Rule } from '@asap-hub/auth0-rule';
import got from 'got';

const connectUser: Rule<{ invitationCode: string }> = async (
  user,
  context,
  callback,
) => {
  if (!context.invitationCode) {
    return callback(null, user, context);
  }

  try {
    const apiURL = configuration?.APP_ORIGIN;
    const apiSharedSecret = configuration?.API_SHARED_SECRET;
    await got
      .post(`${apiURL}/webhook/users/connections`, {
        json: {
          code: context.invitationCode,
          userId: user.user_id,
        },
        headers: {
          Authorization: `Basic ${apiSharedSecret}`,
        },
        timeout: 10000,
      })
      .json();
    return callback(null, user, context);
  } catch (err) {
    return callback(new Error(err));
  }
};

export default connectUser;
