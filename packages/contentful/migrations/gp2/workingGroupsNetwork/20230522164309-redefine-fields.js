module.exports.description = 'Updates workingGroupNetwork';

module.exports.up = (migration) => {
  const workingGroupNetwork = migration.editContentType('workingGroupNetwork');

  workingGroupNetwork.changeFieldControl(
    'operational',
    'builtin',
    'entryLinksEditor',
    {
      showLinkEntityAction: true,
      showCreateEntityAction: false,
    },
  );
  workingGroupNetwork.changeFieldControl(
    'monogenic',
    'builtin',
    'entryLinksEditor',
    {
      showLinkEntityAction: true,
      showCreateEntityAction: false,
    },
  );
  workingGroupNetwork.changeFieldControl(
    'complexDisease',
    'builtin',
    'entryLinksEditor',
    {
      showLinkEntityAction: true,
      showCreateEntityAction: false,
    },
  );
  workingGroupNetwork.changeFieldControl(
    'support',
    'builtin',
    'entryLinksEditor',
    {
      showLinkEntityAction: true,
      showCreateEntityAction: false,
    },
  );
};

module.exports.down = (migration) => {
  const workingGroupNetwork = migration.editContentType('workingGroupNetwork');
};
