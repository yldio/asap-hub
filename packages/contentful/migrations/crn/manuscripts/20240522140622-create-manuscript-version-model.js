module.exports.description =
  'Add fields type and lifecycle to manuscripts content model';

module.exports.up = (migration) => {
  const manuscriptVersions = migration
    .createContentType('manuscriptVersions')
    .name('Manuscript Versions')
    .description('')
    .displayField('type');

  manuscriptVersions
    .createField('type')
    .name('Type')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        in: ['Original Research', 'Review / Op-Ed / Letter / Hot Topic'],
      },
    ])
    .disabled(false)
    .omitted(false);
  manuscriptVersions.changeFieldControl('type', 'builtin', 'dropdown', {
    helpText: 'Type of Manuscript',
  });

  manuscriptVersions
    .createField('lifecycle')
    .name('Lifecycle')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
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
    ])
    .disabled(false)
    .omitted(false);

  manuscriptVersions.changeFieldControl('lifecycle', 'builtin', 'dropdown', {
    helpText: 'Where is the manuscript in the life cycle?',
  });

  const manuscripts = migration.editContentType('manuscripts');

  manuscripts
    .createField('versions')
    .name('Versions')
    .type('Array')
    .localized(false)
    .required(false)
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',
      validations: [
        {
          linkContentType: ['manuscriptVersions'],
        },
      ],
      linkType: 'Entry',
    });
};

module.exports.down = (migration) => {
  const manuscripts = migration.editContentType('manuscripts');
  manuscripts.deleteField('versions');
  migration.deleteContentType('manuscriptVersions');
};
