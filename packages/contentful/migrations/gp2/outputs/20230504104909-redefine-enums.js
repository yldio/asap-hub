module.exports.description = 'Updates enums';

module.exports.up = (migration) => {
  const outputs = migration.editContentType('outputs');

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
  outputs.editField('type').validations([
    {
      in: ['Research', 'Review', 'Letter', 'Hot Topic', 'Blog'],
    },
  ]);
};

module.exports.down = (migration) => {
  const outputs = migration.editContentType('outputs');
  outputs.editField('documentType').items({
    type: 'Symbol',
    validations: [
      {
        in: [],
      },
    ],
  });
  outputs.editField('type').items({
    type: 'Symbol',
    validations: [
      {
        in: [],
      },
    ],
  });
};
