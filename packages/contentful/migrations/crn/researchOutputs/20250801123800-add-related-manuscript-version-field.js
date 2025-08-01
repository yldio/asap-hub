module.exports.description =
  'Add related manuscript version to research output and research output version';

module.exports.up = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');
  const researchOutputVersions = migration.editContentType(
    'researchOutputVersions',
  );

  researchOutputs
    .createField('relatedManuscriptVersion')
    .name('Related Manuscript Version')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['manuscriptVersions'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  researchOutputVersions
    .createField('relatedManuscriptVersion')
    .name('Related Manuscript Version')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['manuscriptVersions'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');
};

module.exports.down = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');
  const researchOutputVersions = migration.editContentType(
    'researchOutputVersions',
  );
  researchOutputs.deleteField('relatedManuscriptVersion');
  researchOutputVersions.deleteField('relatedManuscriptVersion');
};
