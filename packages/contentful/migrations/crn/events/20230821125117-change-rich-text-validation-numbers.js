module.exports.description = 'Change rich text validation';

module.exports.up = (migration) => {
  const richTextValidations = [
    {
      enabledMarks: [
        'bold',
        'italic',
        'underline',
        'code',
        'superscript',
        'subscript',
      ],
      message:
        'Only bold, italic, underline, code, superscript, and subscript marks are allowed',
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
      nodes: {
        'asset-hyperlink': [
          {
            size: {
              min: null,
              max: 15,
            },

            message: null,
          },
        ],

        'embedded-asset-block': [
          {
            size: {
              min: null,
              max: 15,
            },

            message: null,
          },
        ],

        'embedded-entry-block': [
          {
            linkContentType: ['media'],
            message: null,
          },
          {
            size: {
              min: null,
              max: 15,
            },

            message: null,
          },
        ],

        'embedded-entry-inline': [
          {
            linkContentType: ['media'],
            message: null,
          },
          {
            size: {
              min: null,
              max: 15,
            },

            message: null,
          },
        ],

        'entry-hyperlink': [
          {
            linkContentType: ['media'],
            message: null,
          },
          {
            size: {
              min: null,
              max: 15,
            },

            message: null,
          },
        ],
      },
    },
  ];

  const events = migration.editContentType('events');

  events.editField('presentation').validations(richTextValidations);

  events.editField('notes').validations(richTextValidations);

  events.editField('videoRecording').validations(richTextValidations);
};

module.exports.down = (migration) => {
  // back to how it was in 20230404114001-create-events-content-model.js
  const events = migration.editContentType('events');
  events.editField('presentation').validations([
    {
      enabledMarks: [
        'bold',
        'italic',
        'underline',
        'code',
        'superscript',
        'subscript',
      ],
      message:
        'Only bold, italic, underline, code, superscript, and subscript marks are allowed',
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
      nodes: {
        'asset-hyperlink': [
          {
            size: {
              min: null,
              max: 10,
            },

            message: null,
          },
        ],

        'embedded-asset-block': [
          {
            size: {
              min: null,
              max: 10,
            },

            message: null,
          },
        ],

        'embedded-entry-block': [
          {
            size: {
              min: null,
              max: 10,
            },

            message: null,
          },
        ],

        'embedded-entry-inline': [
          {
            size: {
              min: null,
              max: 10,
            },

            message: null,
          },
        ],

        'entry-hyperlink': [
          {
            size: {
              min: null,
              max: 10,
            },

            message: null,
          },
        ],
      },
    },
  ]);

  events.editField('notes').validations([
    {
      enabledMarks: [
        'bold',
        'italic',
        'underline',
        'code',
        'superscript',
        'subscript',
      ],
      message:
        'Only bold, italic, underline, code, superscript, and subscript marks are allowed',
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
      nodes: {
        'asset-hyperlink': [
          {
            size: {
              min: null,
              max: 7,
            },

            message: null,
          },
        ],

        'embedded-asset-block': [
          {
            size: {
              min: null,
              max: 8,
            },

            message: null,
          },
        ],

        'embedded-entry-block': [
          {
            size: {
              min: null,
              max: 10,
            },

            message: null,
          },
        ],

        'embedded-entry-inline': [
          {
            size: {
              min: null,
              max: 6,
            },

            message: null,
          },
        ],

        'entry-hyperlink': [
          {
            size: {
              min: null,
              max: 10,
            },

            message: null,
          },
        ],
      },
    },
  ]);

  events.editField('videoRecording').validations([
    {
      enabledMarks: [
        'bold',
        'italic',
        'underline',
        'code',
        'superscript',
        'subscript',
      ],
      message:
        'Only bold, italic, underline, code, superscript, and subscript marks are allowed',
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
      nodes: {
        'asset-hyperlink': [
          {
            size: {
              min: null,
              max: 10,
            },

            message: null,
          },
        ],

        'embedded-asset-block': [
          {
            size: {
              min: null,
              max: 10,
            },

            message: null,
          },
        ],

        'embedded-entry-block': [
          {
            size: {
              min: null,
              max: 10,
            },

            message: null,
          },
        ],

        'embedded-entry-inline': [
          {
            size: {
              min: null,
              max: 10,
            },

            message: null,
          },
        ],

        'entry-hyperlink': [
          {
            size: {
              min: null,
              max: 10,
            },

            message: null,
          },
        ],
      },
    },
  ]);
};
