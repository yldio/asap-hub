module.exports.description = 'Update accession field validation';

const validationMessage = 'This must start with a letter';

module.exports.up = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');
  const researchOutputVersions = migration.editContentType(
    'researchOutputVersions',
  );
  const newPattern = '^(\\w+\\d+(\\.(\\w?)\\d+)*)|(NP_\\d+)$';

  researchOutputs.editField('accession').validations([
    {
      regexp: {
        pattern: newPattern,
        flags: null,
      },
      message: validationMessage,
    },
  ]);
  researchOutputVersions.editField('accession').validations([
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
  const researchOutputs = migration.editContentType('researchOutputs');
  const researchOutputVersions = migration.editContentType(
    'researchOutputVersions',
  );
  const oldPattern = '^(\\w+\\d+(\\.\\d+)?)|(NP_\\d+)$';

  researchOutputs.editField('accession').validations([
    {
      regexp: {
        pattern: oldPattern,
        flags: null,
      },
      message: validationMessage,
    },
  ]);

  researchOutputVersions.editField('accession').validations([
    {
      regexp: {
        pattern: '^(\\w+\\d+(\\.\\d+)?)|(NP_\\d+)$',
        flags: null,
      },
      message: validationMessage,
    },
  ]);
};
