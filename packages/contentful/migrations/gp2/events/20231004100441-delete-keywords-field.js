module.exports.description = 'Delete keywords field';

module.exports.up = (migration) => {
  const events = migration.editContentType('events');

  events.deleteField('keywords');
};

module.exports.down = (migration) => {
  const events = migration.editContentType('events');

  events
    .createField('keywords')
    .name('Keywords')
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
          linkContentType: ['keywords'],
        },
      ],

      linkType: 'Entry',
    });
};
