module.exports.description = 'Add isInReview field';

module.exports.up = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');
  researchOutputs
    .createField('isInReview')
    .name('Is In Review')
    .type('Boolean')
    .localized(false)
    .required(false)
    .validations([])
    .defaultValue({
      'en-US': false,
    })
    .disabled(false)
    .omitted(false);
  researchOutputs.moveField('isInReview').afterField('statusChangedBy');
};

module.exports.down = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');
  researchOutputs.deleteField('isInReview');
};
