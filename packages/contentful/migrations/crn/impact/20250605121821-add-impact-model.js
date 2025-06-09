module.exports.description = 'Add impact model';

module.exports.up = (migration) => {
  const impact = migration
    .createContentType('impact')
    .name('Impact')
    .description('')
    .displayField('name');

  impact
    .createField('name')
    .name('name')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        unique: true,
      },
    ])
    .disabled(false)
    .omitted(false);

  impact.changeFieldControl('name', 'builtin', 'singleLine', {});
};

module.exports.down = (migration) => {
  migration.deleteContentType('impact');
};
