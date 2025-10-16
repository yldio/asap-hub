module.exports.description = 'Add Data Manager to the role field';

module.exports.up = (migration) => {
  const teamMembership = migration.editContentType('teamMembership');

  teamMembership.editField('role').validations([
    {
      in: [
        'ASAP Staff',
        'Collaborating PI',
        'Co-PI (Core Leadership)',
        'Data Manager',
        'Key Personnel',
        'Lead PI (Core Leadership)',
        'Project Manager',
        'Scientific Advisory Board',
        'Trainee',
      ],
    },
  ]);
};

module.exports.down = (migration) => {
  const teamMembership = migration.editContentType('teamMembership');

  teamMembership.editField('role').validations([
    {
      in: [
        'ASAP Staff',
        'Collaborating PI',
        'Co-PI (Core Leadership)',
        'Key Personnel',
        'Lead PI (Core Leadership)',
        'Project Manager',
        'Scientific Advisory Board',
        'Trainee',
      ],
    },
  ]);
};
