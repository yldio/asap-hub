module.exports.description = 'Updates enums';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');

  users
    .createField('degrees')
    .name('Degrees')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',

      validations: [
        {
          in: [
            'AA',
            'AAS',
            'BA',
            'BSc',
            'MA',
            'MBA',
            'MBBS',
            'MD',
            'MD, PhD',
            'MPH',
            'MSc',
            'PhD',
            'PharmD',
          ],
        },
      ],
    });
  users.deleteField('degree');
  users.editField('telephoneCountryCode').name('Telephone Country Code');
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');
  users.editField('degrees').items({
    type: 'Symbol',
    validations: [
      {
        in: [],
      },
    ],
  });
};
