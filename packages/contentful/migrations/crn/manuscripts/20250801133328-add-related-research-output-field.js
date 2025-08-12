module.exports.description = 'Add related research output field to manuscripts';

module.exports.up = (migration) => {
  const manuscripts = migration.editContentType('manuscripts');

  manuscripts
    .createField('relatedResearchOutput')
    .name('Related Research Output')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['researchOutputs'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');
};

module.exports.down = (migration) => {
  const manuscripts = migration.editContentType('manuscripts');
  manuscripts.deleteField('relatedResearchOutput');
};
