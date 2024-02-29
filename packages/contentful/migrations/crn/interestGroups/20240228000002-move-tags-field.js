module.exports.description = 'Move tags field';

module.exports.up = (migration) => {
  const entity = migration.editContentType('interestGroups');

  entity.moveField('researchTags').afterField('tags');
};
