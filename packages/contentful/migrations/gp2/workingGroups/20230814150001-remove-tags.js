module.exports.description = 'Remove keywords from workingGroups content model';

module.exports.up = (migration) => {
  const workingGroups = migration.editContentType('workingGroups');

  workingGroups.editField('tags').disabled(false);
};

module.exports.down = (migration) => {
  const workingGroups = migration.editContentType('workingGroups');

  workingGroups.editField('tags').disabled(true);
};
