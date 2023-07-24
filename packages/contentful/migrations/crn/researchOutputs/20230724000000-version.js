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
};

module.exports.down = (migration) => {
  migration.deleteContentType('outputVersions');
};
