module.exports.description = 'Add short text field';

module.exports.up = (migration) => {
  const outputs = migration.editContentType('outputs');

  outputs
    .createField('shortText')
    .name('Short Text')
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

  outputs.changeFieldControl('shortText', 'builtin', 'singleLine', {});
  outputs.moveField('shortText').afterField('description');
};

module.exports.down = (migration) => {
  const outputs = migration.editContentType('outputs');
  outputs.deleteField('shortText');
};
