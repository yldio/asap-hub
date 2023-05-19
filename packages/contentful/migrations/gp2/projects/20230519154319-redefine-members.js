module.exports.description = 'Updates projects';

module.exports.up = (migration) => {
  const projects = migration.editContentType('projects');

  projects.changeFieldControl('members', 'builtin', 'entryLinksEditor', {
    showLinkEntityAction: false,
    showCreateEntityAction: true,
  });
};

module.exports.down = (migration) => {
  const projects = migration.editContentType('projects');
};
