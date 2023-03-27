module.exports.description = 'Create external authors content model';

module.exports.up = (migration) => {
  const externalAuthors = migration
    .createContentType('externalAuthors')
    .name('External authors')
    .description('')
    .displayField('name');
  externalAuthors
    .createField('name')
    .name('Name')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  externalAuthors
    .createField('orcid')
    .name('ORCID')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        unique: true,
      },
      {
        regexp: {
          pattern: '^\\d{4}-\\d{4}-\\d{4}-\\d{3}(\\d|X)$',
          flags: null,
        },

        message: 'ORCID must have the following format: 0000-0000-0000-0000',
      },
    ])
    .disabled(false)
    .omitted(false);

  externalAuthors.changeFieldControl('name', 'builtin', 'singleLine', {});
  externalAuthors.changeFieldControl('orcid', 'builtin', 'singleLine', {});
};

module.exports.down = (migration) => {
  migration.deleteContentType('externalAuthors');
};
