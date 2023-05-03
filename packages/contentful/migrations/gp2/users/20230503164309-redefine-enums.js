module.exports.description = 'Enables related entity';

const gp2 = require('@asap-hub/model');
module.exports.up = (migration) => {
  const users = migration.editContentType('outputs');

  users.editField('degree').items({
    type: 'Symbol',

    validations: [
      {
        in: gp2.userDegrees,
      },
    ],
  });
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');
  users.editField('relatedEntity');
};
