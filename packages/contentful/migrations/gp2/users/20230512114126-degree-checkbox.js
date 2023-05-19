module.exports.description = 'Adds positions field';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');

  users.moveField('degrees').afterField('avatar');
  users.changeFieldControl('degrees', 'builtin', 'checkbox', {});
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');
};
