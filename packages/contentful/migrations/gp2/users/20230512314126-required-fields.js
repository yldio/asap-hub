module.exports.description = 'Adds positions field';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');
  users.editField('country').required(true);
  users.editField('region').required(true);
  users.editField('onboarded').required(true);

  users.moveField('positions').afterField('region');
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');
};
