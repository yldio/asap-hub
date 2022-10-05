module.exports.description = 'Adds content type for news.';

module.exports.up = (migration) => {
  const news = migration
        .createContentType('news')
        .name('News')
        .displayField('id')
        .description('ASAP Hub News');

  news.createField('id').name('ID').type('Symbol');

  news.changeFieldControl('id', 'builtin', 'singleLine');
};

module.exports.down = (migration) => migration.deleteContentType('news');
