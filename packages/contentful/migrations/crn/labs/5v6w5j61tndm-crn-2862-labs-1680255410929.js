module.exports.description = 'Create labs content model';

module.exports.up = function (migration) {
  const labs = migration
    .createContentType('labs')
    .name('Labs')
    .description('')
    .displayField('name');
  labs
    .createField('name')
    .name('Name')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
  labs.changeFieldControl('name', 'builtin', 'singleLine', {});
};

module.exports.down = (migration) => {
  migration.deleteContentType('labs');
};
