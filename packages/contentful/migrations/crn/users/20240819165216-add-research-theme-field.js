module.exports.description = 'Add research theme field';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');

  users
    .createField('researchTheme')
    .name('Research Theme')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',
      validations: [],
    });

  users.changeFieldControl('researchTheme', 'builtin', 'tagEditor', {});
  users.moveField('researchTheme').afterField('researchTags');
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');
  users.deleteField('researchTheme');
};
