module.exports.description = 'Create manuscripts content model';

module.exports.up = (migration) => {
  const manuscripts = migration
    .createContentType('manuscripts')
    .name('Manuscripts')
    .description('')
    .displayField('title');

  manuscripts
    .createField('title')
    .name('Title')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  manuscripts.changeFieldControl('title', 'builtin', 'singleLine', {});
};

module.exports.down = (migration) => {
  migration.deleteContentType('manuscripts');
};
