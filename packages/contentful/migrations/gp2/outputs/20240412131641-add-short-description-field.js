module.exports.description = 'Add short description field';

module.exports.up = (migration) => {
  const outputs = migration.editContentType('outputs');

  outputs
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

  outputs.changeFieldControl('shortDescription', 'builtin', 'singleLine', {});
  outputs.moveField('shortDescription').afterField('description');
};

module.exports.down = (migration) => {
  const outputs = migration.editContentType('outputs');
  outputs.deleteField('shortDescription');
};
