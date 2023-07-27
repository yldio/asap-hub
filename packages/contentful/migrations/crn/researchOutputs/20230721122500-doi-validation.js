module.exports.description =
  'Fix regex validation for DOI and Accession fields';

module.exports.up = function (migration) {
  const researchOutputs = migration.editContentType('researchOutputs');

  researchOutputs.editField('accession').validations([
    {
      regexp: {
        pattern: '^(\\w+\\d+(\\.\\d+)?)|(NP_\\d+)$',
        flags: null,
      },
      message: 'This must start with a letter',
    },
  ]);

  researchOutputs.editField('doi').validations([
    {
      regexp: {
        pattern: '^(doi\\:)?\\d{2}\\.\\d{4}.*$',
        flags: null,
      },
      message: 'DOIs must start with a number and cannot be a URL',
    },
  ]);
};

module.exports.down = (migration) => {};
