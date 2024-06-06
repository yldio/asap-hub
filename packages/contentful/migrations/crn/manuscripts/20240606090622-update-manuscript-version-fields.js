module.exports.description =
  'Additional fields added to Manuscript Version model';

module.exports.up = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');
  manuscriptVersions
    .createField('preprintDoi')
    .name('Preprint DOI')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        regexp: {
          pattern: '^10\\.\\d{4}.*$',
          flags: null,
        },
        message: 'Preprint DOI must start with 10',
      },
    ])
    .disabled(false)
    .omitted(false);

  manuscriptVersions
    .createField('publicationDoi')
    .name('Publication DOI')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        regexp: {
          pattern: '^10\\.\\d{4}.*$',
          flags: null,
        },
        message: 'Publication DOI must start with 10',
      },
    ])
    .disabled(false)
    .omitted(false);

  manuscriptVersions
    .createField('requestingApcCoverage')
    .name('Requesting APC Coverage')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        in: ['Yes', 'No', 'Already submitted'],
      },
    ])
    .disabled(false)
    .omitted(false);

  manuscriptVersions
    .createField('details')
    .name('Details')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
};

module.exports.down = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');
  manuscriptVersions.deleteField('preprintDOI');
  manuscriptVersions.deleteField('publicationDOI');
  manuscriptVersions.deleteField('requestingAPCCoverage');
  manuscriptVersions.deleteField('details');
};
