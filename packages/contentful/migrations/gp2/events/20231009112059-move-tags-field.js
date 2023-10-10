module.exports.description = 'Move tags field';

module.exports.up = (migration) => {
  const events = migration.editContentType('events');
  events.moveField('tags').afterField('speakers');
};

module.exports.down = (migration) => {
  const events = migration.editContentType('events');
  events.moveField('tags').afterField('googleId');
};
