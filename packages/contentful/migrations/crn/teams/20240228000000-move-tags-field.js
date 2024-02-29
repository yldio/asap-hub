module.exports.description = 'Move tags field';

module.exports.up = (migration) => {
  const entity = migration.editContentType('teams');

  entity.moveField('researchTags').afterField('expertiseAndResourceTags');
};
