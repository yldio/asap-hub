// TODO
async function connectUser(user, context, callback) {
  if (!context.invitationCode) {
    return callback(null, user, context);
  }

  const got = require('got');

  try {
    await got
      .post(`${configuration.APP_ORIGIN}/webhook/users/connections`, {
        json: {
          code: context.invitationCode,
          userId: user.user_id,
        },
        headers: {
          Authorization: `Basic ${configuration.API_SHARED_SECRET}`,
        },
        timeout: 10000,
      })
      .json();
    return callback(null, user, context);
  } catch (err) {
    return callback(new Error(err));
  }
}
