module.exports.description = 'Add middle name and nickname fields';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');
  users
    .createField('middleName')
    .name('Middle Name')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  users.moveField('middleName').afterField('firstName');

  users
    .createField('nickname')
    .name('Nickname')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  users.moveField('nickname').afterField('lastName');
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');
  users.deleteField('middleName');
  users.deleteField('nickname');
};
