module.exports.description =
  'Rename firstPublicDate to preprintDate (Preprint Date) and add Publication Date field';

module.exports.up = (migration) => {
  const manuscripts = migration.editContentType('manuscripts');

  manuscripts.changeFieldId('firstPublicDate', 'preprintDate');
  manuscripts.editField('preprintDate', { name: 'Preprint Date' });

  manuscripts
    .createField('publicationDate')
    .name('Publication Date')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  manuscripts.moveField('publicationDate').afterField('preprintDate');
};

module.exports.down = (migration) => {
  const manuscripts = migration.editContentType('manuscripts');
  manuscripts.deleteField('publicationDate');
  manuscripts.changeFieldId('preprintDate', 'firstPublicDate');
  manuscripts.editField('firstPublicDate', {
    name: 'Date first made public',
  });
};
