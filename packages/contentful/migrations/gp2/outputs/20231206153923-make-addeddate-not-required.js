module.exports.description = 'Make addedDate not required';

module.exports.up = (migration) => {
  const outputs = migration.editContentType('outputs');

  outputs.editField('addedDate').required(false);
  outputs.changeFieldControl('addedDate', 'app', '1TW8dnAmczxAAQ46SQpQUi');
};

module.exports.down = (migration) => {
  const outputs = migration.editContentType('outputs');

  outputs.editField('addedDate').required(true);
  outputs.changeFieldControl('addedDate', 'builtin', 'datePicker');
};