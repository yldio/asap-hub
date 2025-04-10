module.exports.description = 'Update accession field validation';

module.exports.up = (migration) => {
  const outputs = migration.editContentType('outputs');
  const outputVersion = migration.editContentType('outputVersion');

  outputs.editField('accessionNumber').validations([
    {
      regexp: {
        pattern: '^(\\w+\\d+(\\.(\\w?)\\d+)*)|(NP_\\d+)$',
        flags: null,
      },
      message:
        'Please enter a valid Accession Number which must start with a letter (e.g. NT_123456)',
    },
  ]);
  outputVersion.editField('accessionNumber').validations([
    {
      regexp: {
        pattern: '^(\\w+\\d+(\\.(\\w?)\\d+)*)|(NP_\\d+)$',
        flags: null,
      },
      message:
        'Please enter a valid Accession Number which must start with a letter (e.g. NT_123456)',
    },
  ]);
};

module.exports.down = (migration) => {
  const outputs = migration.editContentType('outputs');
  const outputVersion = migration.editContentType('outputVersion');

  outputs.editField('accessionNumber').validations([
    {
      regexp: {
        pattern: '^(\\w+\\d+(\\.\\d+)?)|(NP_\\d+)$',
        flags: null,
      },
      message:
        'Please enter a valid Accession Number which must start with a letter (e.g. NT_123456)',
    },
  ]);
  outputVersion.editField('accessionNumber').validations([
    {
      regexp: {
        pattern: '^(\\w+\\d+(\\.\\d+)?)|(NP_\\d+)$',
        flags: null,
      },
      message:
        'Please enter a valid Accession Number which must start with a letter (e.g. NT_123456)',
    },
  ]);
};
