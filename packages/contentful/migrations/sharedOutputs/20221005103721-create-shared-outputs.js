module.exports.description = 'Create content model for Research Outputs';

module.exports.up = (migration) => {
  const sharedOutputs = migration
    .createContentType('sharedOutputs')
    .name('Research Outputs')
    .displayField('id')
    .description('');

  sharedOutputs.createField('id').name('ID').type('Symbol');

  sharedOutputs
    .createField('labs')
    .name('Labs')
    .type('Array')
    .items({
      type: 'Link',
      validations: [{ linkContentType: ['labs'] }],
      linkType: 'Entry',
    });

  sharedOutputs
    .createField('authors')
    .name('Authors')
    .type('Array')
    .items({
      type: 'Link',
      validations: [{ linkContentType: ['externalAuthors', 'users'] }],
      linkType: 'Entry',
    });

  sharedOutputs.createField('title').name('Title').type('Symbol');

  sharedOutputs
    .createField('description')
    .name('description')
    .type('RichText')
    .validations([
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
          'ordered-list',
          'unordered-list',
          'hr',
          'blockquote',
          'embedded-entry-block',
          'embedded-asset-block',
          'hyperlink',
          'entry-hyperlink',
          'asset-hyperlink',
          'embedded-entry-inline',
        ],
        message:
          'Only heading 1, heading 2, heading 3, heading 4, heading 5, heading 6, ordered list, unordered list, horizontal rule, quote, block entry, asset, link to Url, link to entry, link to asset, and inline entry nodes are allowed',
      },
      {
        nodes: {
          'asset-hyperlink': [{ size: { max: 20 } }],
          'embedded-asset-block': [{ size: { max: 20 } }],
          'embedded-entry-block': [{ size: { max: 20 } }],
          'embedded-entry-inline': [{ size: { max: 20 } }],
          'entry-hyperlink': [{ size: { max: 20 } }],
        },
      },
    ]);

  sharedOutputs.changeFieldControl('id', 'builtin', 'singleLine');
  sharedOutputs.changeFieldControl('labs', 'builtin', 'entryLinksEditor');
  sharedOutputs.changeFieldControl('authors', 'builtin', 'entryLinksEditor');
  sharedOutputs.changeFieldControl('title', 'builtin', 'singleLine');
  sharedOutputs.changeFieldControl('description', 'builtin', 'richTextEditor');
};

module.exports.down = (migration) =>
  migration.deleteContentType('sharedOutputs');
