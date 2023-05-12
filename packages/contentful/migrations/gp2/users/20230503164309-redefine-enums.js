module.exports.description = 'Updates enums';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');

  users.editField('degree').items({
    type: 'Symbol',
    validations: [
      {
        in: [
          'AA',
          'AAS',
          'BA',
          'BSc',
          'MA',
          'MBA',
          'MBBS',
          'MD',
          'MD, PhD',
          'MPH',
          'MSc',
          'PhD',
          'PharmD',
        ],
      },
    ],
  });
  users
    .editField('role')
    .name('GP2 Hub Role')
    .validations([
      {
        in: [
          'Administrator',
          'Hidden',
          'Network Collaborator',
          'Network Investigator',
          'Trainee',
          'Working Group Participant',
        ],
      },
    ]);
  users.editField('region').validations([
    {
      in: [
        'Africa',
        'Asia',
        'Australia/Australiasia',
        'Europe',
        'Latin America',
        'North America',
        'South America',
      ],
    },
  ]);
  users.changeFieldControl('region', 'builtin', 'dropdown', {});
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');
  users.editField('region').items({
    type: 'Symbol',
    validations: [
      {
        in: [],
      },
    ],
  });
  users.editField('role').items({
    type: 'Symbol',
    validations: [
      {
        in: [],
      },
    ],
  });
  users.editField('degree').items({
    type: 'Symbol',
    validations: [
      {
        in: [],
      },
    ],
  });
};
