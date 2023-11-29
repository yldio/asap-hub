module.exports.description = 'Change documentType field editor';

module.exports.up = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');
  researchOutputs.changeFieldControl(
    'createdDate',
    'app',
    '5k7jEBXizWrEHPIebdDTJN',
  );
};

module.exports.down = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');
  researchOutputs.changeFieldControl(
    'createdDate',
    'builtin',
    'datePicker',
    {},
  );
};
