module.exports.description = 'Remove keywords from users content model';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');

  users.deleteField('keywords');
  users.editField('tags').disabled(false);
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');

  users
    .createField('keywords')
    .name('Keywords')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([
      {
        size: {
          min: 1,
          max: 10,
        },
      },
    ])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',
      validations: [],
    });

  users.editField('tags').disabled(true);
};
