module.exports.description = 'add legacy label to legacy description field';

module.exports.up = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');
  researchOutputs.editField('description').name('Description (legacy)');
};

module.exports.down = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');
  researchOutputs.editField('description').name('Description');
};
