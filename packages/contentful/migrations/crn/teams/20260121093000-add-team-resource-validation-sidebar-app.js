module.exports.description =
  'Add team-resource-validation sidebar app to Teams content model';

module.exports.up = (migration) => {
  const teams = migration.editContentType('teams');

  teams.addSidebarWidget('app', '3OTn7DDwJPaUITZd6lFvZh', {});
};

module.exports.down = (migration) => {
  const teams = migration.editContentType('teams');

  teams.removeSidebarWidget('app', '3OTn7DDwJPaUITZd6lFvZh');
};
