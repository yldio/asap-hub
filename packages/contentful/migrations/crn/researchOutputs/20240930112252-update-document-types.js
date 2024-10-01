module.exports.description =
  'Update Lab Resource document type to Lab Material';

module.exports.up = (migration) => {
  const transformType = (fieldValue) => {
    switch (fieldValue) {
      case 'Lab Resource':
        return 'Lab Material';
      default:
        return fieldValue;
    }
  };

  const researchOutputs = migration.editContentType('researchOutputs');
  researchOutputs.editField('documentType').validations([
    {
      in: [
        'Grant Document',
        'Presentation',
        'Protocol',
        'Dataset',
        'Bioinformatics',
        'Lab Resource',
        'Lab Material',
        'Article',
        'Report',
      ],
    },
  ]);

  migration.transformEntries({
    contentType: 'researchOutputs',
    from: ['documentType'],
    to: ['documentType'],
    transformEntryForLocale: function (fromFields, currentLocale) {
      return {
        documentType: transformType(fromFields.documentType[currentLocale]),
      };
    },
  });

  researchOutputs.editField('documentType').validations([
    {
      in: [
        'Grant Document',
        'Presentation',
        'Protocol',
        'Dataset',
        'Bioinformatics',
        'Lab Material',
        'Article',
        'Report',
      ],
    },
  ]);

  const researchOutputVersions = migration.editContentType(
    'researchOutputVersions',
  );
  researchOutputVersions.editField('documentType').validations([
    {
      in: [
        'Grant Document',
        'Presentation',
        'Protocol',
        'Dataset',
        'Bioinformatics',
        'Lab Resource',
        'Lab Material',
        'Article',
        'Report',
      ],
    },
  ]);

  migration.transformEntries({
    contentType: 'researchOutputVersions',
    from: ['documentType'],
    to: ['documentType'],
    transformEntryForLocale: function (fromFields, currentLocale) {
      return {
        documentType: transformType(fromFields.documentType[currentLocale]),
      };
    },
  });

  researchOutputVersions.editField('documentType').validations([
    {
      in: [
        'Grant Document',
        'Presentation',
        'Protocol',
        'Dataset',
        'Bioinformatics',
        'Lab Material',
        'Article',
        'Report',
      ],
    },
  ]);
};

module.exports.down = (migration) => {
  const transformType = (fieldValue) => {
    switch (fieldValue) {
      case 'Lab Material':
        return 'Lab Resource';
      default:
        return fieldValue;
    }
  };

  const researchOutputs = migration.editContentType('researchOutputs');
  researchOutputs.editField('documentType').validations([
    {
      in: [
        'Grant Document',
        'Presentation',
        'Protocol',
        'Dataset',
        'Bioinformatics',
        'Lab Resource',
        'Lab Material',
        'Article',
        'Report',
      ],
    },
  ]);

  migration.transformEntries({
    contentType: 'researchOutputs',
    from: ['documentType'],
    to: ['documentType'],
    transformEntryForLocale: function (fromFields, currentLocale) {
      return {
        documentType: transformType(fromFields.documentType[currentLocale]),
      };
    },
  });

  researchOutputs.editField('documentType').validations([
    {
      in: [
        'Grant Document',
        'Presentation',
        'Protocol',
        'Dataset',
        'Bioinformatics',
        'Lab Resource',
        'Article',
        'Report',
      ],
    },
  ]);

  const researchOutputVersions = migration.editContentType(
    'researchOutputVersions',
  );
  researchOutputVersions.editField('documentType').validations([
    {
      in: [
        'Grant Document',
        'Presentation',
        'Protocol',
        'Dataset',
        'Bioinformatics',
        'Lab Resource',
        'Lab Material',
        'Article',
        'Report',
      ],
    },
  ]);

  migration.transformEntries({
    contentType: 'researchOutputVersions',
    from: ['documentType'],
    to: ['documentType'],
    transformEntryForLocale: function (fromFields, currentLocale) {
      return {
        documentType: transformType(fromFields.documentType[currentLocale]),
      };
    },
  });

  researchOutputVersions.editField('documentType').validations([
    {
      in: [
        'Grant Document',
        'Presentation',
        'Protocol',
        'Dataset',
        'Bioinformatics',
        'Lab Resource',
        'Article',
        'Report',
      ],
    },
  ]);
};
