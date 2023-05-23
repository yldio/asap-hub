module.exports.description =
  'Add google api metadata as json field and remove syncToken, resourceId and expirationDate';

module.exports.up = (migration) => {
  const calendars = migration.editContentType('calendars');

  calendars.deleteField('syncToken');
  calendars.deleteField('resourceId');
  calendars.deleteField('expirationDate');

  calendars
    .createField('googleApiMetadata')
    .name('Google Api Metadata')
    .type('Object')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  calendars.changeFieldControl(
    'googleApiMetadata',
    'app',
    '2finDNk15g5UtOq4DaLNxv',
    {},
  );
};

module.exports.down = (migration) => {
  const calendars = migration.editContentType('calendars');

  calendars.deleteField('googleApiMetadata');

  calendars
    .createField('syncToken')
    .name('Google Last Sync Token')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(true)
    .omitted(false);

  calendars
    .createField('resourceId')
    .name('Google resource ID')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        unique: true,
      },
    ])
    .disabled(true)
    .omitted(false);

  calendars
    .createField('expirationDate')
    .name('Google subscription expiration date')
    .type('Number')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(true)
    .omitted(false);

  calendars.changeFieldControl('syncToken', 'builtin', 'singleLine', {});
  calendars.changeFieldControl('resourceId', 'builtin', 'singleLine', {});
  calendars.changeFieldControl('expirationDate', 'builtin', 'numberEditor', {});
};
