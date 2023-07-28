module.exports.description = 'Change members editor';

module.exports.up = (migration) => {
  const projects = migration.editContentType('projects');
  projects.changeFieldControl('members', 'app', 'Yp64pYYDuRNHdvAAAJPYa', {
    entityName: 'user',
    showUserEmail: true,
    showLinkEntityAction: false,
    showCreateEntityAction: true,
  });
};

module.exports.down = (migration) => {
  const projects = migration.editContentType('projects');
  projects.changeFieldControl('members', 'builtin', 'entryLinksEditor', {
    showLinkEntityAction: false,
    showCreateEntityAction: true,
  });
};
