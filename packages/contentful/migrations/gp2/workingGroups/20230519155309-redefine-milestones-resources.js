module.exports.description = 'Updates workingGroups';

module.exports.up = (migration) => {
  const workingGroups = migration.editContentType('workingGroups');

  workingGroups.changeFieldControl('resources', 'builtin', 'entryLinksEditor', {
    showLinkEntityAction: false,
    showCreateEntityAction: true,
  });
  workingGroups.changeFieldControl(
    'milestones',
    'builtin',
    'entryLinksEditor',
    {
      showLinkEntityAction: false,
      showCreateEntityAction: true,
    },
  );
};

module.exports.down = (migration) => {
  const workingGroups = migration.editContentType('workingGroups');
};
