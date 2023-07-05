module.exports.description = 'Update news';

module.exports.up = (migration) => {
  const news = migration.editContentType('news');
  news.deleteField('sampleCount');
  news.deleteField('articleCount');
  news.deleteField('cohortCount');

  news
    .createField('type')
    .name('Type')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        in: ['news', 'update'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .defaultValue({ 'en-US': 'news' });
};

module.exports.down = (migration) => {
  const news = migration.editContentType('news');
  news.deleteField('type');
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
};
