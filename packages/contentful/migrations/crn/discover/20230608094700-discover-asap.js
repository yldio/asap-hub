module.exports.description = 'Create Discover ASAP content model';

module.exports.up = function (migration) {
  const discover = migration
    .createContentType('discover')
    .name('Discover ASAP')
    .description('');

  discover
    .createField('pages')
    .name('Guidance')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['pages'],
        },
      ],

      linkType: 'Entry',
    });

  discover
    .createField('training')
    .name('Training')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['tutorials'],
        },
      ],

      linkType: 'Entry',
    });

  discover
    .createField('aboutUs')
    .name('About us')
    .type('RichText')
    .localized(false)
    .required(false)
    .validations([
      {
        enabledMarks: [
          'bold',
          'italic',
          'underline',
          'code',
          'subscript',
          'superscript',
        ],
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
    ])
    .disabled(false)
    .omitted(false);

  discover
    .createField('members')
    .name('ASAP Team Members')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['users'],
        },
      ],

      linkType: 'Entry',
    });

  discover
    .createField('membersTeam')
    .name('ASAP Team')
    .type('Link')
    .localized(false)
    .required(false)
    .disabled(false)
    .omitted(false)
    .validations([
      {
        linkContentType: ['teams'],
      },
    ])
    .linkType('Entry');

  discover
    .createField('scientificAdvisoryBoard')
    .name('Scientific Advisory Board')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['users'],
        },
      ],

      linkType: 'Entry',
    });

  discover.changeFieldControl('aboutUs', 'builtin', 'richTextEditor', {});
};

module.exports.down = (migration) => {
  migration.deleteContentType('discover');
};
