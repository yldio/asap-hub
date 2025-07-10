module.exports.description = 'Add new teams field';

module.exports.up = (migration) => {
  const interestGroups = migration.editContentType('interestGroups');

  interestGroups.editField('teams', {
    name: 'Teams (old)',
  });

  interestGroups
    .createField('teams_new')
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

  interestGroups.changeFieldControl(
    'teams_new',
    'app',
    'Yp64pYYDuRNHdvAAAJPYa',
    {
      entityName: 'team',
    },
  );
};

module.exports.down = (migration) => {
  const interestGroups = migration.editContentType('interestGroups');
  interestGroups.editField('teams', {
    name: 'Teams',
  });
  interestGroups.deleteField('teams_new');
};
