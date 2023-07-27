module.exports.description = 'Change user teams field editor';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');
  users.changeFieldControl('teams', 'app', 'Yp64pYYDuRNHdvAAAJPYa', {
    entityName: 'team',
  });
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');
  users.changeFieldControl('teams', 'app', '2iE2vFoT19Q5u4Rxpio8gz', {});
};
