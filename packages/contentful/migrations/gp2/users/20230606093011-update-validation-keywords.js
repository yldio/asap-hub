module.exports.description = 'remove keyword validation';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');
  users.editField('keywords').items({
    type: 'Symbol',
    validations: [],
  });
  users.changeFieldControl('keywords', 'builtin', 'tagEditor', {});
};

module.exports.down = (migration) => {};
