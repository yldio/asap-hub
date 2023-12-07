module.exports.description = 'Make addedDate not required';

module.exports.up = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');

  researchOutputs.changeFieldControl('addedDate', 'app', '1TW8dnAmczxAAQ46SQpQUi');
};

module.exports.down = (migration) => {
  const outputs = migration.editContentType('outputs');

  researchOutputs.changeFieldControl('addedDate', 'builtin', 'datePicker');
};