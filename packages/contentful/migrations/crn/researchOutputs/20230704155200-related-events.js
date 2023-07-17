module.exports.description = 'Add related events to research outputs';

module.exports.up = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');
  researchOutputs
    .createField('relatedEvents')
    .name('Related Events')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['events'],
        },
      ],

      linkType: 'Entry',
    });
};

module.exports.down = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');
  researchOutputs.deleteField('relatedEvents');
};
