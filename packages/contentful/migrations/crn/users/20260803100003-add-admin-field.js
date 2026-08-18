module.exports.description = 'Add admin field';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');

  users
    .createField('admin')
    .name('Admin')
    .type('Boolean')
    .localized(false)
    .required(false)
    .validations([])
    .defaultValue({
      'en-US': false,
    })
    .disabled(false)
    .omitted(false);

  users.changeFieldControl('admin', 'builtin', 'boolean', {
    trueLabel: 'Yes',
    falseLabel: 'No',
  });
  users.moveField('admin').afterField('role');
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');
  users.deleteField('admin');
};
