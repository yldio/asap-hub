module.exports.description = 'Creates Media content type';

module.exports.up = (migration) => {
  const media = migration
    .createContentType('media')
    .name('Media')
    .description('Videos and PDFs')
    .displayField('url');
  media
    .createField('url')
    .name('url')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  media.changeFieldControl('url', 'builtin', 'urlEditor', {});
};

module.exports.down = (migration) => migration.deleteContentType('media');
