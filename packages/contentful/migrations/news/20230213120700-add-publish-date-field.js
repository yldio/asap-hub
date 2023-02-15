module.exports.description = 'Adds publishDate field';

module.exports.up = function (migration) {
  const news = migration.editContentType('news');
  news
    .createField('publishDate')
    .name('Publish Date')
    .type('Date')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  news.changeFieldControl('publishDate', 'builtin', 'datePicker', {
    ampm: '12',
    format: 'timeZ',
  });
};

module.exports.down = (migration) => {
  const news = migration.editContentType('news');
  news.deleteField('publishDate');
};
