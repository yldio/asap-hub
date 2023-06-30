module.exports.description = 'Updates workingGroups description';

module.exports.up = (migration) => {
  const workingGroups = migration.editContentType('workingGroups');

  workingGroups
    .createField('oldDescription')
    .name('Old Description')
    .type('Text')
    .localized(false)
    .required(true)
    .validations([
      {
        size: {
          max: 2500,
        },
      },
    ])
    .disabled(false)
    .omitted(false);

  migration.transformEntries({
    contentType: 'workingGroups',
    from: ['description'],
    to: ['oldDescription'],
    transformEntryForLocale: function (fromFields, currentLocale) {
      return { oldDescription: fromFields.description[currentLocale] };
    },
  });

  workingGroups.deleteField('description');
  workingGroups
    .createField('description')
    .name('Description')
    .type('RichText')
    .localized(false)
    .required(true)
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
    ])
    .disabled(false)
    .omitted(false);

  migration.transformEntries({
    contentType: 'workingGroups',
    from: ['oldDescription'],
    to: ['description'],
    transformEntryForLocale: function (fromFields, currentLocale) {
      return { description: fromFields.oldDescription[currentLocale] };
    },
  });
  workingGroups.deleteField('oldDescription');
};

module.exports.down = (migration) => {
  const workingGroups = migration.editContentType('workingGroups');
  workingGroups.deleteField('oldDescription');
};
