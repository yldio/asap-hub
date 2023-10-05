module.exports.description = 'Delete keywords content model';

module.exports.up = function (migration) {
  migration.deleteContentType('keywords');
};

module.exports.down = (migration) => {
  const keywords = migration
    .createContentType('keywords')
    .name('Keywords')
    .description('')
    .displayField('name');

  keywords
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

  keywords.changeFieldControl('name', 'builtin', 'singleLine', {});
};
