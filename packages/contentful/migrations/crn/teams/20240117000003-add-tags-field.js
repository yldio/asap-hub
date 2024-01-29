module.exports.description = 'Add tags field';

module.exports.up = (migration) => {
  const teams = migration.editContentType('teams');
  teams
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
  const teams = migration.editContentType('teams');
  teams.deleteField('tags');
};
