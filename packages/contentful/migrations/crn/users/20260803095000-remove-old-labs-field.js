module.exports.description = 'Remove old labs field';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');
  users.deleteField('oldLabs');
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');

  users
    .createField('oldLabs')
    .name('Old Labs')
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
          linkContentType: ['labMembership'],
        },
      ],

      linkType: 'Entry',
    });
};
