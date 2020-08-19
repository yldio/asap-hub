function aspnetWebApi(user, context, callback) {
  if (!context.invitationCode) {
    return callback(null, user, context);
  }

  const request = require('request');
  request.post(
    {
      url: 'https://hub.asap.science/webhook/users/connections',
      json: {
        code: context.invitationCode,
        userId: user.user_id,
        secret: configuration.API_SHARED_SECRET,
      },
      timeout: 10000,
    },
    (err, response, body) => {
      if (err) return callback(new Error(err));
      return callback(null, user, context);
    },
  );
}
