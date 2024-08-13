module.exports.description = 'Add identifier fields to versions';

module.exports.up = (migration) => {
  const researchOutputVersions = migration.editContentType(
    'researchOutputVersions',
  );

  researchOutputVersions
    .createField('doi')
    .name('DOI')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        regexp: {
          pattern: '^(doi\\:)?\\d{2}\\.\\d{4}.*$',
          flags: null,
        },
        message: 'DOIs must start with a number and cannot be a URL',
      },
    ])
    .disabled(false)
    .omitted(false);

  researchOutputVersions
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
        message: 'This must start with "RRID:"',
      },
    ])
    .disabled(false)
    .omitted(false);

  researchOutputVersions
    .createField('accession')
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
        message: 'This must start with a letter',
      },
    ])
    .disabled(false)
    .omitted(false);
};

module.exports.down = (migration) => {
  const researchOutputVersions = migration.editContentType(
    'researchOutputVersions',
  );
  researchOutputVersions.deleteField('doi');
  researchOutputVersions.deleteField('rrid');
  researchOutputVersions.deleteField('accession');
};
