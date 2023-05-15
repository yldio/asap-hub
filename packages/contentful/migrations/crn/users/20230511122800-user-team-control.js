module.exports.description = 'Create events content model';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');

  users.changeFieldControl('teams', 'app', '2iE2vFoT19Q5u4Rxpio8gz', {});
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');

  users.changeFieldControl('teams', 'builtin', 'entryCardsEditor', {
    bulkEditing: false,
    showLinkEntityAction: false,
    showCreateEntityAction: true,
  });
};
