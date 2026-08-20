module.exports.description = 'Add tech support field';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');

  users
    .createField('techSupport')
    .name('Tech Support')
    .type('Boolean')
    .localized(false)
    .required(false)
    .validations([])
    .defaultValue({
      'en-US': false,
    })
    .disabled(false)
    .omitted(false);

  users.changeFieldControl('techSupport', 'builtin', 'boolean', {
    trueLabel: 'Yes',
    falseLabel: 'No',
  });
  users.moveField('techSupport').afterField('openScienceTeamMember');
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');
  users.deleteField('techSupport');
};
