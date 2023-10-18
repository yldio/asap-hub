module.exports.description = 'Create tutorial collection model';

module.exports.up = (migration) => {
  const tutorialCollections = migration
    .createContentType('tutorialCollections')
    .name('Tutorial Collections')
    .description('')
    .displayField('title');

  tutorialCollections
    .createField('title')
    .name('Title')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  tutorialCollections
    .createField('tutorials')
    .name('Tutorials')
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
          linkContentType: ['tutorials'],
        },
      ],

      linkType: 'Entry',
    });
};

module.exports.down = (migration) => {
  migration.deleteContentType('tutorialCollections');
};
