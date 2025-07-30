module.exports.description =
  'Change text field control from single line to multiple line';

module.exports.up = (migration) => {
  const messages = migration.editContentType('messages');
  messages.changeFieldControl('text', 'builtin', 'multipleLine');
};

module.exports.down = (migration) => {
  const messages = migration.editContentType('messages');
  messages.changeFieldControl('text', 'builtin', 'singleLine');
};
