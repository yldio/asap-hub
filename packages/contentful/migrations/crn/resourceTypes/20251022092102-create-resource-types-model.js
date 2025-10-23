module.exports.description = 'Add resource type model';

module.exports.up = (migration) => {
  const resourceType = migration
    .createContentType('resourceType')
    .name('Resource Type')
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
  migration.deleteContentType('resourceType');
};
