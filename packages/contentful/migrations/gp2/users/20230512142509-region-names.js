module.exports.description = 'Updates regions';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');

  users.editField('region').validations([
    {
      in: [
        'Africa',
        'Asia',
        'Australia/Australasia',
        'Europe',
        'Latin America',
        'North America',
        'South America',
      ],
    },
  ]);
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');
};
