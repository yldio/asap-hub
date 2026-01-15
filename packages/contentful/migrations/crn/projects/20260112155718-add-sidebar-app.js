module.exports.description =
  'Add conditional-field-validation sidebar app to Projects content model';

module.exports.up = (migration) => {
  const projects = migration.editContentType('projects');

  projects.addSidebarWidget('app', 'oXPp9wSsw0L6GzJS4yGkG', {});
};

module.exports.down = (migration) => {
  const projects = migration.editContentType('projects');

  projects.removeSidebarWidget('app', 'oXPp9wSsw0L6GzJS4yGkG');
};
