module.exports.description = 'Add additional quick check field';

module.exports.up = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');

  const field = 'availabilityStatement';
  const name = 'Included an Availability Statement?';

  manuscriptVersions
    .createField(field)
    .name(name)
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        in: ['Yes', 'No'],
      },
    ])
    .disabled(false)
    .omitted(false);

  manuscriptVersions
    .createField(`${field}Details`)
    .name(`${name} (Details)`)
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  manuscriptVersions.changeFieldControl(
    `${field}Details`,
    'builtin',
    'singleLine',
    {},
  );

  manuscriptVersions
    .moveField(field)
    .afterField('labMaterialsRegisteredDetails');
  manuscriptVersions.moveField(`${field}Details`).afterField(field);
};

module.exports.down = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');

  manuscriptVersions.deleteField('availabilityStatement');
  manuscriptVersions.deleteField('availabilityStatementDetails');
};
