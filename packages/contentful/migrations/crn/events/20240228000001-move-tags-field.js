module.exports.description = 'Move tags field';

module.exports.up = (migration) => {
  const entity = migration.editContentType('events');

  entity.moveField('researchTags').afterField('tags');
};

