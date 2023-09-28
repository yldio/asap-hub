module.exports.description = '<Put your description here>';

module.exports.up = (migration) => {
  const news = migration.editContentType('news');

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

  news.changeFieldControl('thumbnail', 'builtin', 'assetLinkEditor', {});
  news.moveField('thumbnail').afterField('shortText');
};

module.exports.down = (migration) => {
  const news = migration.editContentType('news');
  news.deleteField('thumbnail');
};
