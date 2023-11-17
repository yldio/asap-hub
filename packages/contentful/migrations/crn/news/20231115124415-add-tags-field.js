module.exports.description = 'Add tags field';

module.exports.up = (migration) => {
  const news = migration.editContentType('news');
  news
    .createField('tags')
    .name('Tags')
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
          linkContentType: ['researchTags'],
        },
      ],

      linkType: 'Entry',
    });
  news.moveField('tags').afterField('linkText');
};

module.exports.down = (migration) => {
  const news = migration.editContentType('news');
  news.deleteField('tags');
};
