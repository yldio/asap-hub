module.exports.description = 'Add related events to research outputs';

module.exports.up = (migration) => {
  const outputs = migration.editContentType('outputs');
  outputs
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
  outputs.moveField('relatedEvents').afterField('relatedOutputs');
};

module.exports.down = (migration) => {
  const researchOutputs = migration.editContentType('outputs');
  researchOutputs.deleteField('relatedEvents');
};
