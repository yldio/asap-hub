module.exports.description =
  'Add conditional-field-validation sidebar app to Teams content model';

module.exports.up = (migration) => {
  const teams = migration.editContentType('teams');

  teams.addSidebarWidget('app', 'oXPp9wSsw0L6GzJS4yGkG', {});
};

module.exports.down = (migration) => {
  const teams = migration.editContentType('teams');

  teams.removeSidebarWidget('app', 'oXPp9wSsw0L6GzJS4yGkG');
};
