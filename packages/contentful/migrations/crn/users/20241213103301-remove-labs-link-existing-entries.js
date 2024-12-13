module.exports.description = 'Allow only creation of lab membership';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');

  users.changeFieldControl('labs', 'builtin', 'entryLinksEditor', {
    showLinkEntityAction: false,
    showCreateEntityAction: true,
  });
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');

  users.changeFieldControl('labs', 'builtin', 'entryLinksEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: true,
  });
};
