module.exports.description = 'Create content-type tags';

module.exports.up = (migration) => {
  const tags = migration
    .createContentType('tags')
    .name('Tags')
    .description('')
    .displayField('name');

  tags
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

  tags.changeFieldControl('name', 'builtin', 'singleLine', {});
};

module.exports.down = (migration) => {
  migration.deleteContentType('tags');
};
