module.exports.description =
  'Add helper text to project membership projectMember field';

module.exports.up = (migration) => {
  const projectMembership = migration.editContentType('projectMembership');

  projectMembership.changeFieldControl(
    'projectMember',
    'builtin',
    'entryLinkEditor',
    {
      showLinkEntityAction: true,
      showCreateEntityAction: false,
      helpText:
        'User-based projects: add users only. Team-based projects: add teams only.',
    },
  );
};

module.exports.down = (migration) => {
  const projectMembership = migration.editContentType('projectMembership');

  projectMembership.changeFieldControl(
    'projectMember',
    'builtin',
    'entryLinkEditor',
    {
      showLinkEntityAction: true,
      showCreateEntityAction: false,
      helpText: '',
    },
  );
};
