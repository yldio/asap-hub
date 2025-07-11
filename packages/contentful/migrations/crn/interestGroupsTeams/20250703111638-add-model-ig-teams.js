module.exports.description = 'Adds Interest Group Team content type';

module.exports.up = (migration) => {
  const interestGroupsTeams = migration.createContentType(
    'interestGroupsTeams',
    {
      name: 'Interest Group Team',
    },
  );

  interestGroupsTeams.createField('team', {
    name: 'Team',
    type: 'Link',
    linkType: 'Entry',
    required: true,
    validations: [
      {
        linkContentType: ['teams'],
      },
    ],
  });

  interestGroupsTeams.createField('startDate', {
    name: 'Start Date',
    type: 'Date',
    required: true,
  });

  interestGroupsTeams.createField('endDate', {
    name: 'End Date',
    type: 'Date',
    required: false,
  });

  interestGroupsTeams.changeFieldControl('team', 'builtin', 'entryLinkEditor', {
    bulkEditing: false,
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });
};

module.exports.down = (migration) => {
  migration.deleteContentType('interestGroupsTeams');
};
