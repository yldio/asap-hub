module.exports.description = 'Remove old labs field';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');
  users.deleteField('labs_old');

  users.moveField('labs').afterField('teams');
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');
  users
    .createField('labs_old')
    .name('Deprecated Labs')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['labs'],
        },
      ],

      linkType: 'Entry',
    });
};
