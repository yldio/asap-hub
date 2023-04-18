module.exports.description = 'Adds content type for news.';

module.exports.up = function (migration) {
  const news = migration
    .createContentType('news')
    .name('News')
    .description('ASAP Hub News')
    .displayField('title');
  news
    .createField('title')
    .name('Title')
    .type('Text')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
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
    .createField('sampleCount')
    .name('Number of samples')
    .type('Integer')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
  news
    .createField('articleCount')
    .name('Number of articles')
    .type('Integer')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
  news
    .createField('cohortCount')
    .name('Number of cohorts')
    .type('Integer')
    .localized(false)
    .required(true)
    .validations([])
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
    .createField('publishDate')
    .name('Publish Date')
    .type('Date')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
  news.changeFieldControl('title', 'builtin', 'singleLine', {});

  news.changeFieldControl('shortText', 'builtin', 'multipleLine', {
    helpText: 'The text visible on the card version of News',
  });

  news.changeFieldControl('link', 'builtin', 'singleLine', {});

  news.changeFieldControl('linkText', 'builtin', 'singleLine', {
    helpText: 'Leave this empty to show "Open External Link"',
  });

  news.changeFieldControl('publishDate', 'builtin', 'datePicker', {
    ampm: '12',
    format: 'timeZ',
  });
};

module.exports.down = (migration) => migration.deleteContentType('news');
