module.exports.description = 'Add related outputs to outputs content model';

module.exports.up = (migration) => {
  const outputs = migration.editContentType('outputs');

  outputs
    .createField('relatedOutputs')
    .name('Related Outputs')
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
          linkContentType: ['outputs'],
        },
      ],

      linkType: 'Entry',
    });
};

module.exports.down = (migration) => {
  migration.editContentType('outputs').deleteField('relatedOutputs');
};
