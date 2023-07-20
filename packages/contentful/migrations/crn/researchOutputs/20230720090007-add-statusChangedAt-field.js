module.exports.description = 'Add statusChangedAt field';

module.exports.up = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');
  researchOutputs
    .createField('statusChangedAt')
    .name('Status Changed At')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  researchOutputs.moveField('statusChangedAt').afterField('statusChangedBy');
};

module.exports.down = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');
  researchOutputs.deleteField('statusChangedAt');
};
