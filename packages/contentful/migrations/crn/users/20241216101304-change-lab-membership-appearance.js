module.exports.description = 'Change lab membership appearance';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');
  users.changeFieldControl('labs', 'app', 'Yp64pYYDuRNHdvAAAJPYa', {
    entityName: 'lab',
    showUserEmail: false,
    showLinkEntityAction: false,
    showCreateEntityAction: true,
  });
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');

  users.changeFieldControl('labs', 'builtin', 'entryLinksEditor', {
    showLinkEntityAction: false,
    showCreateEntityAction: true,
  });
};
