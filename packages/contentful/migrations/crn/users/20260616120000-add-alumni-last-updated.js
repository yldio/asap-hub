module.exports.description =
  'Add alumniLastUpdated field to CRN users (auto-stamped via field-as-updated-at app)';

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
      observedField: 'alumniSinceDate,alumniLocation,email',
    },
  );

  users.moveField('alumniLastUpdated').afterField('alumniLocation');
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');
  users.deleteField('alumniLastUpdated');
};
