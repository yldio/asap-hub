async function addUserMetadata(user, context, callback) {
  const got = require('got');

  try {
    const {
      id,
      displayName,
      email,
      firstName,
      lastName,
      avatarURL,
    } = await got(`${configuration.APP_ORIGIN}/webhook/users/${user.userId}`, {
      headers: {
        Authorization: `Basic ${configuration.API_SHARED_SECRET}`,
      },
      timeout: 10000,
    }).json();

    context.idToken[`${configuration.APP_ORIGIN}/user`] = {
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
}
