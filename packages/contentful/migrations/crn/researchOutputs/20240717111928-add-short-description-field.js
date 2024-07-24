module.exports.description = 'Add short description field';

module.exports.up = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');

  researchOutputs
    .createField('shortDescription')
    .name('Short Description')
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

  researchOutputs.changeFieldControl(
    'shortDescription',
    'builtin',
    'singleLine',
    {},
  );
  researchOutputs.moveField('shortDescription').afterField('descriptionMD');
};

module.exports.down = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');
  researchOutputs.deleteField('shortDescription');
};
