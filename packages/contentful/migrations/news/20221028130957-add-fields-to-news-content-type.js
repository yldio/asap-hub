module.exports.description = 'Adds fields in news content type.';

module.exports.up = function (migration) {
  const news = migration.editContentType('news');

  news
    .createField('title')
    .name('Title')
    .type('Text')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
  news.displayField('title');
  news
    .createField('shortText')
    .name('Short Text')
    .type('Text')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  news
    .createField('thumbnail')
    .name('Thumbnail')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkMimetypeGroup: ['image'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Asset');

  news
    .createField('frequency')
    .name('Frequency')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        in: ['Biweekly Newsletter', 'CRN Quarterly', 'News Articles'],
      },
    ])
    .disabled(false)
    .omitted(false);

  news
    .createField('link')
    .name('External Link')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        regexp: {
          pattern:
            '^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-/]))?$',
          flags: null,
        },

        message: 'Please provide a valid URL',
      },
    ])
    .disabled(false)
    .omitted(false);

  news
    .createField('linkText')
    .name('External Link Text')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  news
    .createField('text')
    .name('Text')
    .type('RichText')
    .localized(false)
    .required(false)
    .validations([
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
        enabledMarks: ['bold', 'italic', 'underline', 'code'],
        message: 'Only bold, italic, underline, and code marks are allowed',
      },
    ])
    .disabled(false)
    .omitted(false);

  news.changeFieldControl('title', 'builtin', 'singleLine', {});

  news.changeFieldControl('shortText', 'builtin', 'multipleLine', {
    helpText: 'The text visible on the card version of News',
  });

  news.changeFieldControl('thumbnail', 'builtin', 'assetLinkEditor', {});
  news.changeFieldControl('frequency', 'builtin', 'dropdown', {});
  news.changeFieldControl('link', 'builtin', 'singleLine', {});

  news.changeFieldControl('linkText', 'builtin', 'singleLine', {
    helpText: 'Leave this empty to show "Open External Link"',
  });

  news.changeFieldControl('text', 'builtin', 'richTextEditor', {});
};

module.exports.down = (migration) => {
  const news = migration.createContentType('news');
  news.displayField('id');
  [
    'title',
    'shortText',
    'thumbnail',
    'frequency',
    'link',
    'linkText',
    'text',
  ].forEach((field) => {
    news.deleteField(field);
  });
};
