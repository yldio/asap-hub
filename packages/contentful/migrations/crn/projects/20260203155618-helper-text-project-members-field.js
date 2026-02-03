module.exports.description = '<Put your description here>';

module.exports.up = (migration) => {
  const contentTypes = migration.editContentType('projects');
  
  contentTypes.editField('members')
    .name('Members (Users and Teams)')
    .helpText('User-based projects: add users only. Team-based projects: add teams only.');
};

module.exports.down = (migration) => {
  const contentTypes = migration.editContentType('projects');
  
  contentTypes.editField('members')
    .name('Members')
    .helpText('');
};
