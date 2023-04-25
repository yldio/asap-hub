module.exports.description = 'Add created date to users';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');
  users
    .createField('createdDate')
    .name('Created')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');
  users.deleteField('createdDate');
};
