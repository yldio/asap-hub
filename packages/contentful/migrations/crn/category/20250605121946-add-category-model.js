module.exports.description = 'Add category model';

module.exports.up = (migration) => {
  const category = migration
    .createContentType('category')
    .name('Category')
    .description('')
    .displayField('name');

  category
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

  category.changeFieldControl('name', 'builtin', 'singleLine', {});
};

module.exports.down = (migration) => {
  migration.deleteContentType('category');
};
