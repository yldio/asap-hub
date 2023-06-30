module.exports.description = 'Updates workingGroups description';

module.exports.up = (migration) => {
  const workingGroups = migration.editContentType('workingGroups');

  workingGroups
    .editField('description')
    .type('RichText')
    .validations([
      {
        size: {
          max: 2500,
        },
      },
      {
        enabledMarks: ['bold', 'italic', 'underline', 'code'],
        message: 'Only bold, italic, underline, and code marks are allowed',
      },
      {
        enabledNodeTypes: [
          'heading-1',
          'heading-2',
          'heading-3',
          'heading-4',
          'heading-5',
          'heading-6',
          'embedded-entry-block',
          'hyperlink',
          'entry-hyperlink',
          'asset-hyperlink',
          'embedded-entry-inline',
        ],

        message:
          'Only heading 1, heading 2, heading 3, heading 4, heading 5, heading 6, block entry, link to Url, link to entry, link to asset, and inline entry nodes are allowed',
      },
      {
        nodes: {},
      },
    ]);
};

module.exports.down = (migration) => {
  const workingGroups = migration.editContentType('workingGroups');
};
