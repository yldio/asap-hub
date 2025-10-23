module.exports.description = 'Add resource type model';

module.exports.up = (migration) => {
  const resourceTypes = migration
    .createContentType('resourceType')
    .name('Resource Type')
    .description('')
    .displayField('name');

  resourceTypes
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

  resourceTypes.changeFieldControl('name', 'builtin', 'singleLine', {});
};

module.exports.down = (migration) => {
  migration.deleteContentType('resourceType');
};
