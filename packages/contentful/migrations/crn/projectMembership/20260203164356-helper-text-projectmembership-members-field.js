module.exports.description = 'Add helper text to project membership projectMember field';

module.exports.up = (migration) => {
  const contentTypes = migration.editContentType('projectMembership');

  contentTypes.changeFieldControl('projectMember', 'builtin', 'entryLinkEditor', {
    helpText:
      'User-based projects: add users only. Team-based projects: add teams only.',
  });
};

module.exports.down = (migration) => {
  const contentTypes = migration.editContentType('projectMembership');

  contentTypes.changeFieldControl('projectMember', 'builtin', 'entryLinkEditor', {
    helpText:
      '',
  });
};
