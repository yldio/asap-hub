module.exports.description = 'Adds Title field to news.';

module.exports.up = (migration) => {
  const news = migration.editContentType('news');

  news.createField('title').type('Text').name('Title');
};

module.exports.down = (migration) => {
  const news = migration.editContentType('news');

  news.deleteField('title');
};
