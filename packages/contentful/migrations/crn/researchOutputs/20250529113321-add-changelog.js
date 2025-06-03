module.exports.description = 'Add changelog field';

module.exports.up = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');

  researchOutputs
    .createField('changelog')
    .name('Changelog')
    .type('Text')
    .localized(false)
    .required(false)
    .validations([
      {
        size: {
          min: null,
          max: 250,
        },
      },
    ])
    .disabled(false)
    .omitted(false);

  researchOutputs.changeFieldControl('changelog', 'builtin', 'multipleLine');
  researchOutputs.moveField('changelog').afterField('shortDescription');
};

module.exports.down = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');
  researchOutputs.deleteField('changelog');
};
