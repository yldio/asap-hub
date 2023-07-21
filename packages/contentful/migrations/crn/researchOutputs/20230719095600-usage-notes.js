module.exports.description = 'Change usageNotes type';

module.exports.up = function (migration) {
  const researchOutputs = migration.editContentType('researchOutputs');

  researchOutputs.deleteField('usageNotes');

  researchOutputs
    .createField('usageNotes')
    .name('Usage Notes')
    .type('Text')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
};

module.exports.down = (migration) => {};
