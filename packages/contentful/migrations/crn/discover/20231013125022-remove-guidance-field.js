module.exports.description = 'remove guidance field';

module.exports.up = (migration) => {
  // Add your UP migration script here. See examples here:
  // https://github.com/contentful/migration-cli/tree/master/examples
  const discover = migration.editContentType('discover');

  discover.deleteField('pages');
};

module.exports.down = (migration) => {
  // Add your DOWN migration script here. See examples here:
  // https://github.com/contentful/migration-cli/tree/master/examples
  const discover = migration.editContentType('discover');

  discover
    .createField('pages')
    .name('Guidance')
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
          linkContentType: ['pages'],
        },
      ],

      linkType: 'Entry',
    });

  discover.moveField('pages').toTheTop();
};
