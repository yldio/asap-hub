module.exports.description = '<Put your description here>';

module.exports.up = (migration) => {
  const news = migration.editContentType('news');

  news.displayField('title');

  news.createField('title', {
    name: 'Title',
    type: 'Text',
    localized: false,
    required: true,
    validations: [],
    disabled: false,
    omitted: false,
  });

  news.createField('shortText', {
    name: 'Short Text',
    type: 'Symbol',
  });

  news.createField('thumbnail', {
    name: 'Thumbnail',
    type: 'Symbol',
    type: 'Link',
    linkType: 'Asset',
    validations: [
      {
        linkMimetypeGroup: ['image'],
      },
    ],
  });

  news.createField('frequency', {
    name: 'Frequency',
    type: 'Symbol',
    validations: [
      {
        in: ['Biweekly Newsletter', 'CRN Quarterly', 'News Articles'],
      },
    ],
  });

  news.createField('externalLink', {
    name: 'External Link',
    type: 'Symbol',
    validations: [],
  });

  news.createField('externalLinkText', {
    type: 'Symbol',
    name: 'External Link Text',
    validations: [],
  });

  news.createField('text', {
    type: 'RichText',
    name: 'Text',
    id: 'text',
    validations: [
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
          'table',
          'hyperlink',
          'entry-hyperlink',
          'asset-hyperlink',
          'embedded-entry-inline',
        ],
        message:
          'Only heading 1, heading 2, heading 3, heading 4, heading 5, heading 6, ordered list, unordered list, horizontal rule, quote, block entry, asset, table, link to Url, link to entry, link to asset, and inline entry nodes are allowed',
      },
      {
        nodes: {},
      },
    ],
  });
};

module.exports.down = (migration) => {
  const news = migration.createContentType('news');
  news.displayField('id');
  [
    'title',
    'shortText',
    'thumbnail',
    'frequency',
    'externalLink',
    'externalLinkText',
    'text',
  ].forEach((field) => {
    news.deleteField(field);
  });
};
