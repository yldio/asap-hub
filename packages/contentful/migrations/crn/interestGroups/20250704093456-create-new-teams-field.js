module.exports.description = 'Add new teams field';

module.exports.up = (migration) => {
  const interestGroups = migration.editContentType('interestGroups');
  interestGroups.changeFieldId('teams', 'teams_old');

  interestGroups.editField('teams_old', {
    name: 'Teams (old)',
  });

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
          linkContentType: ['interestGroupsTeams'],
        },
      ],

      linkType: 'Entry',
    });

  interestGroups.changeFieldControl('teams', 'app', 'Yp64pYYDuRNHdvAAAJPYa', {
    entityName: 'team',
  });
};

module.exports.down = (migration) => {
  const interestGroups = migration.editContentType('interestGroups');
  interestGroups.changeFieldId('teams', 'teams_old');
  interestGroups.editField('teams_old', {
    name: 'Teams (old)',
  });

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
    showCreateEntityAction: true,
  });
};
