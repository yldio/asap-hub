module.exports.description = 'Create guide content model';

module.exports.up = (migration) => {
  const guideContent = migration
    .createContentType('guideContent')
    .name('Guide Content')
    .description('')
    .displayField('title');
  guideContent
    .createField('title')
    .name('Title')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  guideContent
    .createField('linkText')
    .name('Link Text')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  guideContent
    .createField('linkURL')
    .name('Link URL')
    .type('Symbol')
    .localized(false)
    .required(true)
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

  guideContent
    .createField('text')
    .name('Text')
    .type('Text')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  const guides = migration
    .createContentType('guides')
    .name('Guides')
    .description('')
    .displayField('title');
  guides
    .createField('title')
    .name('Title')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  guides
    .createField('content')
    .name('Content')
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
          linkContentType: ['guideContent'],
        },
      ],

      linkType: 'Entry',
    });
};

module.exports.down = (migration) => {
  migration.deleteContentType('guideContent');
  migration.deleteContentType('guides');
};
