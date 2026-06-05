module.exports.description = 'Add alumniSinceDate and alumniLocation fields to GP2 users';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');

  users
    .createField('alumniSinceDate')
    .name('Alumni Since Date')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  users
    .createField('alumniLocation')
    .name('Alumni New Location')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  users.changeFieldControl('alumniSinceDate', 'builtin', 'datePicker', {});
  users.changeFieldControl('alumniLocation', 'builtin', 'singleLine', {});
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');

  users.deleteField('alumniSinceDate');
  users.deleteField('alumniLocation');
};
