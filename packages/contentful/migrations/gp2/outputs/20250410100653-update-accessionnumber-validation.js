module.exports.description = 'Update accession field validation';

const validationMessage =
  'Please enter a valid Accession Number which must start with a letter (e.g. NT_123456)';

module.exports.up = (migration) => {
  const outputs = migration.editContentType('outputs');
  const outputVersion = migration.editContentType('outputVersion');

  const newPattern = '^\\w+\\d+(\\.(\\w?)\\d+)*$';

  outputs.editField('accessionNumber').validations([
    {
      regexp: {
        pattern: newPattern,
        flags: null,
      },
      message: validationMessage,
    },
  ]);
  outputVersion.editField('accessionNumber').validations([
    {
      regexp: {
        pattern: newPattern,
        flags: null,
      },
      message: validationMessage,
    },
  ]);
};

module.exports.down = (migration) => {
  const outputs = migration.editContentType('outputs');
  const outputVersion = migration.editContentType('outputVersion');

  const oldPattern = '^(\\w+\\d+(\\.\\d+)?)|(NP_\\d+)$';

  outputs.editField('accessionNumber').validations([
    {
      regexp: {
        pattern: oldPattern,
        flags: null,
      },
      message: validationMessage,
    },
  ]);
  outputVersion.editField('accessionNumber').validations([
    {
      regexp: {
        pattern: oldPattern,
        flags: null,
      },
      message: validationMessage,
    },
  ]);
};
