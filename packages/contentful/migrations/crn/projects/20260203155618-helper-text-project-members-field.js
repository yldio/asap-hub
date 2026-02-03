module.exports.description = 'Add helper text to project members field';

module.exports.up = (migration) => {
  const contentTypes = migration.editContentType('projects');

  contentTypes.editField('members').name('Members (Users and Teams)');

  contentTypes.changeFieldControl('members', 'builtin', 'entryLinksEditor', {
    helpText:
      'User-based projects: add users only. Team-based projects: add teams only.',
  });
};

module.exports.down = (migration) => {
  const contentTypes = migration.editContentType('projects');

  contentTypes.editField('members').name('Members');

  contentTypes.changeFieldControl('members', 'builtin', 'entryLinksEditor', {
    helpText:
      '',
  });
};
