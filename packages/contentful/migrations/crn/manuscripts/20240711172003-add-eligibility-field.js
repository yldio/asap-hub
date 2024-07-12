module.exports.description = 'Create eligibility field';

module.exports.up = (migration) => {
  const manuscripts = migration.editContentType('manuscripts');

  manuscripts
    .createField('eligibilityReasons')
    .name('Eligibility Reasons')
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
          in: ['projects', 'method-or-resource', 'pivot', 'leadership'],
        },
      ],
    });
  manuscripts.changeFieldControl(
    'eligibilityReasons',
    'builtin',
    'checkbox',
    {},
  );
};

module.exports.down = (migration) => {
  const manuscripts = migration.editContentType('manuscripts');
  manuscripts.deleteField('eligibilityReasons');
};
