module.exports.description = 'Change leaders field editor';

module.exports.up = (migration) => {
  const interestGroups = migration.editContentType('interestGroups');
  interestGroups.changeFieldControl('leaders', 'app', 'Yp64pYYDuRNHdvAAAJPYa', {
    entityName: 'user',
    showUserEmail: true,
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });
};

module.exports.down = (migration) => {
  const interestGroups = migration.editContentType('interestGroups');
  interestGroups.changeFieldControl('leaders', 'builtin', 'entryCardsEditor', {
    bulkEditing: false,
    showLinkEntityAction: false,
    showCreateEntityAction: true,
  });
};
