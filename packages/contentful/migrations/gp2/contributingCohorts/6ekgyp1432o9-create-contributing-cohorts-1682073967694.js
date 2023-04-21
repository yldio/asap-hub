module.exports.description = 'Create contributing cohorts content model';

module.exports.up = function (migration) {
  const contributingCohorts = migration
    .createContentType('contributingCohorts')
    .name('Contributing Cohorts')
    .description('')
    .displayField('name');

  contributingCohorts
    .createField('name')
    .name('Name')
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

  contributingCohorts.changeFieldControl('name', 'builtin', 'singleLine', {});
};

module.exports.down = (migration) => {
  migration.deleteContentType('contributingCohorts');
};
