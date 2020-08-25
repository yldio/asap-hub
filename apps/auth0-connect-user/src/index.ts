import type { Rule } from '@asap-hub/auth0-rule';
import got from 'got';

const connectUser: Rule<{ invitation_code: string }> = async (
  user,
  context,
  callback,
) => {
  if (!context.invitation_code) {
    return callback(null, user, context);
  }

  try {
    const apiURL = configuration?.APP_ORIGIN;
    const apiSharedSecret = configuration?.API_SHARED_SECRET;
    await got
      .post(`${apiURL}/webhook/users/connections`, {
        json: {
          code: context.invitation_code,
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
