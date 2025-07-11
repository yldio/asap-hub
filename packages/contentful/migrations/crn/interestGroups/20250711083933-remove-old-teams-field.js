module.exports.description = 'Remove old teams field';

module.exports.up = (migration) => {
  const interestGroups = migration.editContentType('interestGroups');

  interestGroups.deleteField('teams');
  interestGroups.changeFieldId('teams_new', 'teams');
};

module.exports.down = (migration) => {
  const interestGroups = migration.editContentType('interestGroups');
  interestGroups.changeFieldId('teams', 'teams_new');

  interestGroups
    .createField('teams')
    .name('Teams')
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
          linkContentType: ['teams'],
        },
      ],

      linkType: 'Entry',
    });

  interestGroups.changeFieldControl('teams', 'builtin', 'entryCardsEditor', {
    bulkEditing: false,
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });
};
