import got from 'got';
import type { Rule } from './types';

const connectUser: Rule<{ invitation_code: string }> = async (
  user,
  context,
  callback,
) => {
  const invitationCode: string = context.request.query?.invitation_code;

  if (!invitationCode) {
    return callback(null, user, context);
  }

  try {
    const apiURL = configuration?.APP_ORIGIN;
    const apiSharedSecret = configuration?.API_SHARED_SECRET;
    await got
      .post(`${apiURL}/webhook/users/connections`, {
        json: {
          code: invitationCode,
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
    if (err instanceof Error) {
      return callback(err);
    }
    return callback(new Error('Unexpected Error'));
  }
};

export default connectUser;
