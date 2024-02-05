module.exports.description = 'Add state/province field';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');

  users
    .createField('stateOrProvince')
    .name('State/Province')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  users.changeFieldControl('stateOrProvince', 'builtin', 'singleLine', {});
  users.moveField('stateOrProvince').afterField('country');
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');
  users.deleteField('stateOrProvince');
};
