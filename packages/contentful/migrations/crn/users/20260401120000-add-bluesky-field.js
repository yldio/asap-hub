module.exports.description = 'Add BlueSky field to users';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');

  users
    .createField('blueSky')
    .name('BlueSky')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  users.changeFieldControl('blueSky', 'builtin', 'singleLine', {});
  users.moveField('blueSky').afterField('researchGate');
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');
  users.deleteField('blueSky');
};
