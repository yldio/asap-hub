module.exports.description = 'Change contributingCohort field editor';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');
  users.changeFieldControl(
    'contributingCohorts',
    'app',
    'Yp64pYYDuRNHdvAAAJPYa',
    {
      entityName: 'contributingCohort',
      bulkEditing: false,
      showLinkEntityAction: false,
      showCreateEntityAction: true,
    },
  );
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');
  users.changeFieldControl(
    'contributingCohorts',
    'builtin',
    'entryLinksEditor',
    {
      bulkEditing: false,
      showLinkEntityAction: false,
      showCreateEntityAction: true,
    },
  );
};
