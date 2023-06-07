module.exports.description = 'update social';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');
  users.editField('orcid').validations([
    {
      unique: true,
    },
  ]);
};

module.exports.down = (migration) => {};
