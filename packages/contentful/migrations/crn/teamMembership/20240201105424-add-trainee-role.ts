module.exports.description = 'Add trainee to the role field';

module.exports.up = function (migration) {
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

module.exports.down = (migration) => {
  const teamMembership = migration.editContentType('teamMembership');

  teamMembership.editField('role').validations([
    {
      in: [
        'Lead PI (Core Leadership)',
        'Co-PI (Core Leadership)',
        'Project Manager',
        'Collaborating PI',
        'Key Personnel',
        'ASAP Staff',
        'Scientific Advisory Board',
      ],
    },
  ]);
};
