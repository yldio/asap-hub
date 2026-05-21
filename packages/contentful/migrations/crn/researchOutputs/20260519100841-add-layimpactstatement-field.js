module.exports.description = 'Add Lay Impact Statement field';

module.exports.up = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');

  researchOutputs
    .createField('layImpactStatement')
    .name('Lay Impact Statement')
    .type('Text')
    .localized(false)
    .required(false)
    .validations([
      {
        size: {
          min: null,
          max: 100,
        },
      },
    ])
    .disabled(false)
    .omitted(false);

  researchOutputs.moveField('layImpactStatement').afterField('impact');
  researchOutputs.changeFieldControl(
    'layImpactStatement',
    'builtin',
    'multipleLine',
  );
};

module.exports.down = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');
  researchOutputs.deleteField('layImpactStatement');
};
