module.exports.description = 'Remove id from news content model';

module.exports.up = (migration) => {
  const news = migration.editContentType('news');
  news.deleteField('id');
};

module.exports.down = (migration) => {
  const news = migration.editContentType('news');
  news.createField('id').name('ID').type('Symbol');
  news.changeFieldControl('id', 'builtin', 'singleLine');
};
