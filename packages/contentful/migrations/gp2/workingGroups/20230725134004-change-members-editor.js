module.exports.description = 'Change members field editor';

module.exports.up = (migration) => {
  const workingGroups = migration.editContentType('workingGroups');
  workingGroups.changeFieldControl('members', 'app', 'Yp64pYYDuRNHdvAAAJPYa', {
    entityName: 'user',
    showLinkEntityAction: false,
    showCreateEntityAction: true,
  });
};

module.exports.down = (migration) => {
  const workingGroups = migration.editContentType('workingGroups');
  workingGroups.changeFieldControl('members', 'builtin', 'entryLinksEditor', {
    showLinkEntityAction: false,
    showCreateEntityAction: true,
  });
};
