module.exports.description = 'Limit number of links';

module.exports.up = (migration) => {
  const pages = migration.editContentType('pages');

  pages
    .editField('text')
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
          'table',
          'hyperlink',
          'entry-hyperlink',
          'asset-hyperlink',
        ],

        message:
          'Only heading 1, heading 2, heading 3, heading 4, heading 5, heading 6, ordered list, unordered list, horizontal rule, quote, table, link to Url, link to entry, and link to asset nodes are allowed',
      },
      {
        nodes: {
          'asset-hyperlink': [
            {
              size: {
                max: 10,
              },

              message: null,
            },
          ],

          'embedded-asset-block': [
            {
              size: {
                max: 7,
              },

              message: null,
            },
          ],

          'embedded-entry-block': [
            {
              size: {
                max: 7,
              },

              message: null,
            },
          ],

          'embedded-entry-inline': [
            {
              size: {
                max: 10,
              },

              message: null,
            },
          ],

          'entry-hyperlink': [
            {
              size: {
                max: 8,
              },

              message: null,
            },
          ],
        },
      },
    ])
    .disabled(false)
    .omitted(false);
};

module.exports.down = (migration) => {
  const pages = migration.editContentType('pages');

  pages
    .editField('text')
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
          'table',
          'hyperlink',
          'entry-hyperlink',
          'asset-hyperlink',
        ],

        message:
          'Only heading 1, heading 2, heading 3, heading 4, heading 5, heading 6, ordered list, unordered list, horizontal rule, quote, table, link to Url, link to entry, and link to asset nodes are allowed',
      },
      {
        nodes: {},
      },
    ])
    .disabled(false)
    .omitted(false);
};
