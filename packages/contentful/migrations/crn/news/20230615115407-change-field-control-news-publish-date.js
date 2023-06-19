module.exports.description = 'Change news publishDate field control';

module.exports.up = (migration) => {
  const news = migration.editContentType('news');

  news.editField('publishDate').required(false);

  news.changeFieldControl('publishDate', 'app', '6AEbdOZc7KICbwW6KszNlp');
};

module.exports.down = (migration) => {
  const news = migration.editContentType('news');

  news.editField('publishDate').required(true);

  news.changeFieldControl('publishDate', 'builtin', 'datePicker');
};
