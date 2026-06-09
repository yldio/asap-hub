module.exports.description = 'Add alumniLastUpdated to users';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');

  users
    .createField('alumniLastUpdated')
    .name('Alumni Last Updated')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  users.changeFieldControl(
    'alumniLastUpdated',
    'app',
    'mqvX9KU5AthRTlnIRhNNh',
    {
      observedField: 'alumniSinceDate,alumniLocation',
    },
  );

  users.moveField('alumniLastUpdated').afterField('alumniLocation');
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');
  users.deleteField('alumniLastUpdated');
};
