module.exports.description = 'Change users publishDate field control';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');

  users.changeFieldControl('createdDate', 'app', '6AEbdOZc7KICbwW6KszNlp');
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');

  users.changeFieldControl('createdDate', 'builtin', 'datePicker', {});
};
