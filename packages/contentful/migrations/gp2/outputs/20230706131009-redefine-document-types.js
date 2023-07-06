module.exports.description = 'Updates document types';

module.exports.up = (migration) => {
  const outputs = migration.editContentType('outputs');

  outputs.editField('documentType').validations([
    {
      in: [
        'Procedural Form',
        'Update',
        'GP2 Reports',
        'Training Materials',
        'Data Release',
        'Dataset',
        'Article',
        'Code/Software',
      ],
    },
  ]);

  migration.transformEntries({
    contentType: 'outputs',
    from: ['documentType'],
    to: ['documentType'],
    transformEntryForLocale: function (fromFields, currentLocale) {
      const transformType = (fieldValue) => {
        switch (fieldValue) {
          case 'Update':
            return 'GP2 Reports';
          case 'Data Release':
            return 'Dataset';
          default:
            return fieldValue;
        }
      };
      return { documentType: transformType(fromFields.documentType[currentLocale]) }
    },
  });

  outputs.editField('documentType').validations([
    {
      in: [
        'Procedural Form',
        'GP2 Reports',
        'Training Materials',
        'Dataset',
        'Article',
        'Code/Software',
      ],
    },
  ]);
};

module.exports.down = (migration) => {
  const outputs = migration.editContentType('outputs');

  outputs.editField('documentType').validations([
    {
      in: [
        'Procedural Form',
        'Update',
        'GP2 Reports',
        'Training Materials',
        'Data Release',
        'Dataset',
        'Article',
        'Code/Software',
      ],
    },
  ]);

  migration.transformEntries({
    contentType: 'outputs',
    from: ['documentType'],
    to: ['documentType'],
    transformEntryForLocale: function (fromFields, currentLocale) {
      const transformType = (fieldValue) => {
        switch (fieldValue) {
          case 'GP2 Reports':
            return 'Update';
          case 'Dataset':
            return 'Data Release';
          default:
            return fieldValue;
        }
      };
      return { documentType: transformType(fromFields.documentType[currentLocale]) }
    },
  });

  outputs.editField('documentType').validations([
    {
      in: [
        'Procedural Form',
        'Update',
        'Training Materials',
        'Data Release',
        'Article',
        'Code/Software',
      ],
    },
  ]);
};
