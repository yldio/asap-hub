module.exports.description = 'Add tags field';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');
  users
    .createField('tags')
    .name('Tags')
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
          linkContentType: ['researchTags'],
        },
      ],

      linkType: 'Entry',
    });
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');
  users.deleteField('tags');
};