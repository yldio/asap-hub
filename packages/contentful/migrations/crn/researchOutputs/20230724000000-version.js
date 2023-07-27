module.exports.description = 'Change usageNotes type';

module.exports.up = function (migration) {
  const outputVersions = migration
    .createContentType('outputVersions')
    .name('Output Versions')
    .description('')
    .displayField('title');

  outputVersions
    .createField('title')
    .name('Title')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  outputVersions
    .createField('versions')
    .name('Versions')
    .type('Array')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['researchOutputs'],
        },
      ],

      linkType: 'Entry',
    });

  const researchOutputs = migration.editContentType('researchOutputs');

  researchOutputs
    .createField('versions')
    .name('Versions')
    .type('Link')
    .localized(false)
    .required(false)
    .disabled(false)
    .omitted(false)
    .validations([
      {
        linkContentType: ['outputVersions'],
      },
    ])
    .linkType('Entry');
};

module.exports.down = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');
  researchOutputs.deleteField('versions');
  migration.deleteContentType('outputVersions');
};
