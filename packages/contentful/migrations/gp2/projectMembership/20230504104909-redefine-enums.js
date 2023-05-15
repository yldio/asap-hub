module.exports.description = 'Updates enums';

module.exports.up = (migration) => {
  const projectMembership = migration.editContentType('projectMembership');

  projectMembership.editField('role').validations([
    {
      in: [
        'Contributor',
        'Investigator',
        'Project co-lead',
        'Project lead',
        'Project manager',
      ],
    },
  ]);
};

module.exports.down = (migration) => {
  const projectMembership = migration.editContentType('projectMembership');
  projectMembership.editField('role').items({
    type: 'Symbol',
    validations: [
      {
        in: [],
      },
    ],
  });
};
