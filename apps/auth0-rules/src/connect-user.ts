import got from 'got';
import { handleError } from './handle-error';
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
    const error = handleError(err);
    return callback(error);
  }
};

export default connectUser;
