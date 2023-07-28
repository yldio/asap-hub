module.exports.description = 'Change working group members field editor';

module.exports.up = (migration) => {
  const workingGroups = migration.editContentType('workingGroups');
  workingGroups.changeFieldControl('members', 'app', 'Yp64pYYDuRNHdvAAAJPYa', {
    entityName: 'user',
    bulkEditing: false,
    showLinkEntityAction: true,
    showCreateEntityAction: true,
  });
};

module.exports.down = (migration) => {
  const workingGroups = migration.editContentType('workingGroups');
  workingGroups.changeFieldControl('members', 'builtin', 'entryLinksEditor', {
    bulkEditing: false,
    showLinkEntityAction: true,
    showCreateEntityAction: true,
  });
};
