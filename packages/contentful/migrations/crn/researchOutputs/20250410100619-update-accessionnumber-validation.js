module.exports.description = 'Update accession field validation';

module.exports.up = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');
  const researchOutputVersions = migration.editContentType(
    'researchOutputVersions',
  );

  researchOutputs.editField('accession').validations([
    {
      regexp: {
        pattern: '^(\\w+\\d+(\\.(\\w?)\\d+)*)|(NP_\\d+)$',
        flags: null,
      },
      message: 'This must start with a letter',
    },
  ]);
  researchOutputVersions.editField('accession').validations([
    {
      regexp: {
        pattern: '^(\\w+\\d+(\\.(\\w?)\\d+)*)|(NP_\\d+)$',
        flags: null,
      },
      message: 'This must start with a letter',
    },
  ]);
};

module.exports.down = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');
  const researchOutputVersions = migration.editContentType(
    'researchOutputVersions',
  );

  researchOutputs.editField('accession').validations([
    {
      regexp: {
        pattern: '^(\\w+\\d+(\\.\\d+)?)|(NP_\\d+)$',
        flags: null,
      },
      message: 'This must start with a letter',
    },
  ]);

  researchOutputVersions.editField('accession').validations([
    {
      regexp: {
        pattern: '^(\\w+\\d+(\\.\\d+)?)|(NP_\\d+)$',
        flags: null,
      },
      message: 'This must start with a letter',
    },
  ]);
};
