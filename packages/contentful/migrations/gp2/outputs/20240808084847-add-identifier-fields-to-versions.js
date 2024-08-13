module.exports.description = 'Add identifier fields to versions';

module.exports.up = (migration) => {
  const outputVersion = migration.editContentType('outputVersion');

  outputVersion
    .createField('doi')
    .name('DOI')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        regexp: {
          pattern: '^10\\.\\d{4}.*$',
          flags: null,
        },

        message:
          'Please enter a valid DOI which starts with a 10. and it cannot be a URL. (e.g. 10.5555/YFRU1371.121212)',
      },
    ])
    .disabled(false)
    .omitted(false);

  outputVersion
    .createField('rrid')
    .name('RRID')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        regexp: {
          pattern: '^RRID:[a-zA-Z]+.+$',
          flags: null,
        },

        message:
          'Please enter a valid RRID which starts with `RRID`. (e.g. RRID:AB_007358)',
      },
    ])
    .disabled(false)
    .omitted(false);

  outputVersion
    .createField('accessionNumber')
    .name('Accession')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        regexp: {
          pattern: '^(\\w+\\d+(\\.\\d+)?)|(NP_\\d+)$',
          flags: null,
        },

        message:
          'Please enter a valid Accession Number which must start with a letter (e.g. NT_123456)',
      },
    ])
    .disabled(false)
    .omitted(false);
};

module.exports.down = (migration) => {
  const outputVersion = migration.editContentType('outputVersion');

  outputVersion.deleteField('doi');
  outputVersion.deleteField('rrid');
  outputVersion.deleteField('accessionNumber');
};
