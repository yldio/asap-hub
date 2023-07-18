module.exports.description =
  'Rename reviewRequestedBy field to statusChangedBy';

module.exports.up = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');

  researchOutputs.changeFieldId('reviewRequestedBy', 'statusChangedBy');
  researchOutputs.editField('statusChangedBy').name('Status Changed By');
  researchOutputs.moveField('statusChangedBy').afterField('updatedBy');
};

module.exports.down = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');

  researchOutputs.changeFieldId('statusChangedBy', 'reviewRequestedBy');
  researchOutputs.editField('reviewRequestedBy').name('Review Requested By');
  researchOutputs.moveField('reviewRequestedBy').afterField('updatedBy');
};
