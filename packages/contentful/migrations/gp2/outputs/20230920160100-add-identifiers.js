module.exports.description = 'Add identifiers to output model';

module.exports.up = function (migration) {
  const outputs = migration.editContentType('outputs');

  outputs
    .createField('doi')
    .name('Identifier (DOI)')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        regexp: {
          pattern: '^(doi\\:)?\\d{2}\\.\\d{4}.*$',
          flags: null,
        },

        message:
          'Please enter a valid DOI which starts with a 10. and it cannot be a URL. (e.g. 10.5555/YFRU1371.121212)',
      },
    ])
    .disabled(false)
    .omitted(false);

  outputs
    .createField('rrid')
    .name('Identifier (RRID)')
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

  outputs
    .createField('accessionNumber')
    .name('Identifier (Accession Number)')
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

  outputs.changeFieldControl('doi', 'builtin', 'singleLine', {});
  outputs.changeFieldControl('rrid', 'builtin', 'singleLine', {});
  outputs.changeFieldControl('accessionNumber', 'builtin', 'singleLine', {});
};

module.exports.down = function (migration) {
  const outputs = migration.editContentType('outputs');

  outputs.deleteField('doi');
  outputs.deleteField('rrid');
  outputs.deleteField('accessionNumber');
};
