module.exports.description = 'Create content model for External Authors';

module.exports.up = (migration) => {
  const externalAuthors = migration
    .createContentType('externalAuthors')
    .name('External Authors')
    .displayField('id')
    .description('');

  externalAuthors.createField('id').name('ID').type('Symbol');

  externalAuthors
    .createField('separatorBasicData')
    .name('Basic Data')
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
      { nodes: {} },
    ]);

  externalAuthors.createField('firstName').name('First Name').type('Symbol');

  externalAuthors.createField('lastName').name('Last Name').type('Symbol');

  externalAuthors.createField('email').name('Email').type('Symbol');

  externalAuthors.createField('orcid').name('ORCID').type('Symbol');

  externalAuthors
    .createField('teams')
    .name('Teams')
    .type('Array')
    .items({
      type: 'Link',
      validations: [{ linkContentType: ['teams'] }],
      linkType: 'Entry',
    });

  externalAuthors
    .createField('labs')
    .name('Labs')
    .type('Array')
    .items({
      type: 'Link',
      validations: [{ linkContentType: ['labs'] }],
      linkType: 'Entry',
    });

  externalAuthors.changeFieldControl('id', 'builtin', 'singleLine');
  externalAuthors.changeFieldControl(
    'separatorBasicData',
    'builtin',
    'richTextEditor',
  );
  externalAuthors.changeFieldControl('firstName', 'builtin', 'singleLine');
  externalAuthors.changeFieldControl('lastName', 'builtin', 'singleLine');
  externalAuthors.changeFieldControl('email', 'builtin', 'singleLine');
  externalAuthors.changeFieldControl('orcid', 'builtin', 'singleLine');
  externalAuthors.changeFieldControl('teams', 'builtin', 'entryLinksEditor');
  externalAuthors.changeFieldControl('labs', 'builtin', 'entryLinksEditor');
};

module.exports.down = (migration) =>
  migration.deleteContentType('externalAuthors');
