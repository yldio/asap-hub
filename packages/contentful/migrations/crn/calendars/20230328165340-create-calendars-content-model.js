module.exports.description = 'Create calendars content model';

module.exports.up = (migration) => {
  const calendars = migration
    .createContentType('calendars')
    .name('Calendars')
    .description('')
    .displayField('name');
  calendars
    .createField('name')
    .name('Name')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  calendars
    .createField('googleCalendarId')
    .name('Google Calendar ID')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        unique: true,
      },
      {
        size: {
          min: 8,
        },
      },
      {
        regexp: {
          pattern:
            '^[a-zA-Z0-9.!#$%&’*+\\\\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$',
          flags: null,
        },
      },
    ])
    .disabled(false)
    .omitted(false);

  calendars
    .createField('color')
    .name('Color')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        in: [
          '#B1365F',
          '#5C1158',
          '#711616',
          '#691426',
          '#BE6D00',
          '#B1440E',
          '#853104',
          '#8C500B',
          '#754916',
          '#88880E',
          '#AB8B00',
          '#856508',
          '#28754E',
          '#1B887A',
          '#28754E',
          '#0D7813',
          '#528800',
          '#125A12',
          '#2F6309',
          '#2F6213',
          '#0F4B38',
          '#5F6B02',
          '#4A716C',
          '#6E6E41',
          '#29527A',
          '#2952A3',
          '#4E5D6C',
          '#5A6986',
          '#182C57',
          '#060D5E',
          '#113F47',
          '#7A367A',
          '#5229A3',
          '#865A5A',
          '#705770',
          '#23164E',
          '#5B123B',
          '#42104A',
          '#875509',
          '#8D6F47',
          '#6B3304',
          '#333333',
        ],
      },
    ])
    .disabled(false)
    .omitted(false);

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
  calendars.changeFieldControl('name', 'builtin', 'singleLine', {});

  calendars.changeFieldControl('googleCalendarId', 'builtin', 'singleLine', {
    helpText:
      'Make sure this GCal is Public BEFORE adding it. Syncing will NOT work otherwise.',
  });

  calendars.changeFieldControl('color', 'builtin', 'dropdown', {});
  calendars.changeFieldControl('syncToken', 'builtin', 'singleLine', {});
  calendars.changeFieldControl('resourceId', 'builtin', 'singleLine', {});
  calendars.changeFieldControl('expirationDate', 'builtin', 'numberEditor', {});
};

module.exports.down = (migration) => {
  migration.deleteContentType('calendars');
};
