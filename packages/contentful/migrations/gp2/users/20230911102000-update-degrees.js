module.exports.description = 'update degrees';

module.exports.up = function (migration) {
  const users = migration.editContentType('users');

  users.editField('degrees').items({
    type: 'Symbol',

    validations: [
      {
        in: [
          'AA',
          'AAS',
          'BA',
          'BSc',
          'DO',
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
};

module.exports.down = function (migration) {
  const users = migration.editContentType('users');

  users.editField('degree').items({
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
};
