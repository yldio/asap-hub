module.exports.description =
  'Add alumniSinceDate, alumniLocation and alumniLastUpdated to users';

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

  users
    .createField('alumniLastUpdated')
    .name('Alumni Last Updated')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(true)
    .omitted(false);

  users.changeFieldControl('alumniSinceDate', 'builtin', 'datePicker', {});
  users.changeFieldControl('alumniLocation', 'builtin', 'singleLine', {});
  users.changeFieldControl(
    'alumniLastUpdated',
    'app',
    'mqvX9KU5AthRTlnIRhNNh',
    {
      observedField: 'alumniSinceDate,alumniLocation',
    },
  );

  users.moveField('alumniSinceDate').afterField('orcidWorks');
  users.moveField('alumniLocation').afterField('alumniSinceDate');
  users.moveField('alumniLastUpdated').afterField('alumniLocation');
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');
  users.deleteField('alumniLastUpdated');
  users.deleteField('alumniLocation');
  users.deleteField('alumniSinceDate');
};
