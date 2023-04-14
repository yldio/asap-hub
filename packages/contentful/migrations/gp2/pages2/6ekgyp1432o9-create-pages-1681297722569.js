module.exports.description = 'Adds content type for pages2.';

module.exports.up = (migration) => {
  const pages = migration
    .createContentType('pages2')
    .name('Pages 2')
    .description('')
    .displayField('title');
  pages
    .createField('title')
    .name('Title')
    .type('Text')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  pages
    .createField('path')
    .name('Path')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        unique: true,
      },
    ])
    .disabled(false)
    .omitted(false);

  pages
    .createField('shortText')
    .name('Short Text')
    .type('Text')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  pages
    .createField('text')
    .name('Text')
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
          'hyperlink',
          'embedded-entry-inline',
          'entry-hyperlink',
          'embedded-asset-block',
          'asset-hyperlink',
        ],

        message:
          'Only heading 1, heading 2, heading 3, heading 4, heading 5, heading 6, ordered list, unordered list, horizontal rule, quote, block entry, link to Url, inline entry, link to entry, asset, and link to asset nodes are allowed',
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
    ])
    .disabled(false)
    .omitted(false);

  pages
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
      },
    ])
    .disabled(false)
    .omitted(false);

  pages
    .createField('linkText')
    .name('External Link Text')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  pages.changeFieldControl('title', 'builtin', 'singleLine', {});
  pages.changeFieldControl('path', 'builtin', 'singleLine', {});
  pages.changeFieldControl('shortText', 'builtin', 'singleLine', {});
  pages.changeFieldControl('text', 'builtin', 'richTextEditor', {});
  pages.changeFieldControl('link', 'builtin', 'urlEditor', {});
  pages.changeFieldControl('linkText', 'builtin', 'singleLine', {});
};

module.exports.down = (migration) => migration.deleteContentType('pages2');
