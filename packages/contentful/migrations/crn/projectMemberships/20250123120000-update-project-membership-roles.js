module.exports.description =
  'Update project membership roles to include new role definitions';

module.exports.up = function (migration) {
  const projectMembership = migration.editContentType('projectMembership');

  projectMembership.editField('role').validations([
    {
      in: [
        'Lead PI',
        'Co-PI',
        'Collaborating PI',
        'Project Manager',
        'Data Manager',
        'Staff Scientist',
        'ASAP Staff',
        'Trainee',
        'Trainee Project - Lead',
        'Trainee Project - Mentor',
        'Trainee Project - Key Personnel',
      ],
    },
  ]);
};

module.exports.down = function (migration) {
  const projectMembership = migration.editContentType('projectMembership');

  projectMembership.editField('role').validations([
    {
      in: [
        'Contributor',
        'Investigator',
        'Project CoLead',
        'Project Lead',
        'Project Manager',
      ],
    },
  ]);
};
