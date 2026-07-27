module.exports.description = 'Add personal email field';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');

  users
    .createField('personalEmail')
    .name('Personal Email')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        regexp: {
          pattern: "^\\w[\\w.\\-+']*@([\\w-]+\\.)+[\\w-]+$",
          flags: null,
        },
      },
    ])
    .disabled(false)
    .omitted(false);

  users.changeFieldControl('personalEmail', 'builtin', 'singleLine', {});
  users.moveField('personalEmail').afterField('contactEmail');
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');
  users.deleteField('personalEmail');
};
