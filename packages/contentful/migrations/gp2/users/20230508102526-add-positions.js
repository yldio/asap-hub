module.exports.description = 'Adds positions field';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');

  users
    .createField('positions')
    .name('Positions')
    .type('Object')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  users.changeFieldControl('positions', 'app', '6gJUoMACdM5WFGRz6j4pbB', {});
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');
  users.deleteField('positions');
};
