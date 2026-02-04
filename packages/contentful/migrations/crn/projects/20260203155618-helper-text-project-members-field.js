module.exports.description = 'Add helper text to project members field';

module.exports.up = (migration) => {
  const projects = migration.editContentType('projects');

  projects.editField('members').name('Members (Users and Teams)');

  projects.changeFieldControl('members', 'app', 'Yp64pYYDuRNHdvAAAJPYa', {
    entityName: 'projectMember',
    showUserEmail: false,
    showLinkEntityAction: false,
    showCreateEntityAction: true,
    helpText:
      'User-based projects: add users only. Team-based projects: add teams only.',
  });
};

module.exports.down = (migration) => {
  const projects = migration.editContentType('projects');

  projects.editField('members').name('Members');

  projects.changeFieldControl('members', 'app', 'Yp64pYYDuRNHdvAAAJPYa', {
    entityName: 'projectMember',
    showUserEmail: false,
    showLinkEntityAction: false,
    showCreateEntityAction: true,
    helpText: '',
  });
};
