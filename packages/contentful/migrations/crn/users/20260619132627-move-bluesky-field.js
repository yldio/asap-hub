module.exports.description = 'Move Bluesky field';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');
  users.moveField('blueSky').afterField('researcherId');
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');
  users.moveField('blueSky').toTheBottom();
};
