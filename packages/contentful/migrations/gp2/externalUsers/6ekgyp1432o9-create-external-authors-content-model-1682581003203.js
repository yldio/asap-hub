module.exports.description = 'Create external users content model';

module.exports.up = (migration) => {
  const externalUsers = migration
    .createContentType('externalUsers')
    .name('External users')
    .description('')
    .displayField('name');
  externalUsers
    .createField('name')
    .name('Name')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  externalUsers
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

  externalUsers.changeFieldControl('name', 'builtin', 'singleLine', {});
  externalUsers.changeFieldControl('orcid', 'builtin', 'singleLine', {});
};

module.exports.down = (migration) => {
  migration.deleteContentType('externalUsers');
};
