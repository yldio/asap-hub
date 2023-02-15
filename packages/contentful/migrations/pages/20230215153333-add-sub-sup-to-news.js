module.exports.description = 'Add sub/sup to Pages';

module.exports.up = (migration) => {
  const pages = migration.editContentType('pages');

  pages.editField('text').validations([
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
        'superscript',
        'subscript',
      ],

      message:
        'Only heading 1, heading 2, heading 3, heading 4, heading 5, heading 6, ordered list, unordered list, horizontal rule, quote, block entry, asset, link to Url, link to entry, link to asset, and inline entry nodes are allowed',
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
              max: 10,
            },

            message: '',
          },
        ],

        'embedded-entry-block': [
          {
            size: {
              max: 10,
            },

            message: '',
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
              max: 10,
            },

            message: null,
          },
        ],
      },
    },
  ]);
};

module.exports.down = (migration) => {
  const pages = migration.editContentType('pages');

  pages.editField('text').validations([
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
              max: 10,
            },

            message: '',
          },
        ],

        'embedded-entry-block': [
          {
            size: {
              max: 10,
            },

            message: '',
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
              max: 10,
            },

            message: null,
          },
        ],
      },
    },
  ]);
};
