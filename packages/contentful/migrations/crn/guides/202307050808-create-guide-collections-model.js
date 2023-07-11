module.exports.description = 'Create guide collection model';

module.exports.up = (migration) => {
  const guideCollections = migration
    .createContentType('guideCollections')
    .name('Guide Collections')
    .description('')
    .displayField('title');
  guideCollections
    .createField('title')
    .name('Title')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  guideCollections
    .createField('guides')
    .name('Guides')
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
          linkContentType: ['guides'],
        },
      ],

      linkType: 'Entry',
    });
};

module.exports.down = (migration) => {
  migration.deleteContentType('guideCollections');
};
