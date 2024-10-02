module.exports.description =
  'Update Lab Resource document type to Lab Material';

module.exports.up = (migration) => {
  const transformType = (fromFields, currentLocale) => {
    if (
      fromFields.documentType &&
      fromFields.documentType[currentLocale] === 'Lab Resource'
    )
      return {
        documentType: 'Lab Material',
      };
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
    transformEntryForLocale: transformType,
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
    transformEntryForLocale: transformType,
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
  const transformType = (fromFields, currentLocale) => {
    if (
      fromFields.documentType &&
      fromFields.documentType[currentLocale] === 'Lab Material'
    )
      return {
        documentType: 'Lab Resource',
      };
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
    transformEntryForLocale: transformType,
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
    transformEntryForLocale: transformType,
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
