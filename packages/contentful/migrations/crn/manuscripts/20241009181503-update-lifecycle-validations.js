module.exports.description = 'Update Lifecycle Validations';

module.exports.up = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');

  manuscriptVersions.editField('lifecycle').validations([
    {
      in: [
        'Draft Manuscript(prior to Publication)',
        'Preprint',
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
