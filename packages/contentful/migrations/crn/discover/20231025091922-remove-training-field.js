module.exports.description = 'remove training field';

module.exports.up = (migration) => {
  const discover = migration.editContentType('discover');

  discover.deleteField('training');
};

module.exports.down = (migration) => {
  discover
    .createField('training')
    .name('Training')
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

  discover.moveField('training').toTheTop();
};
