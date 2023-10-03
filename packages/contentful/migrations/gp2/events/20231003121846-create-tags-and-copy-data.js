module.exports.description = 'Create tags field';

module.exports.up = (migration) => {
  const events = migration.editContentType('events');

  events
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
          linkContentType: ['tags'],
        },
      ],

      linkType: 'Entry',
    });
};

module.exports.down = (migration) => {
  const events = migration.editContentType('events');

  events.deleteField('tags');
};
