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
    .createField('otherDetails')
    .name('Other Details')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  manuscriptVersions.editField('lifecycle').validations([
    {
      in: [
        'Draft manuscript (prior to preprint submission)',
        'Revised Draft Manuscript (prior to preprint submission)',
        'Preprint, version 1',
        'Preprint, version 2',
        'Preprint, version 3+',
        'Typeset proof',
        'Publication',
        'Publication with addendum or corrigendum',
        'Other',
      ],
    },
  ]);
};

module.exports.down = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');
  manuscriptVersions.deleteField('preprintDoi');
  manuscriptVersions.deleteField('publicationDoi');
  manuscriptVersions.deleteField('requestingApcCoverage');
  manuscriptVersions.deleteField('otherDetails');
  manuscriptVersions.editField('lifecycle').validations([
    {
      in: [
        'Draft manuscript (prior to preprint submission)',
        'Draft manuscript',
        'Revised Draft Manuscript (prior to preprint submission)',
        'Revised Draft Manuscript',
        'Preprint, version 1',
        'Preprint, version 2',
        'Preprint, version 3+',
        'Typeset proof',
        'Publication',
        'Publication with addendum or corrigendum',
        'Other',
      ],
    },
  ]);
};
