module.exports.description = 'Create external authors content model';

module.exports.up = (migration) => {
  const guides = migration
    .createContentType('guides')
    .name('Guides')
    .description('')
    .displayField('name');
  guides
    .createField('name')
    .name('Name')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
};

module.exports.down = (migration) => {
  migration.deleteContentType('guides');
};
