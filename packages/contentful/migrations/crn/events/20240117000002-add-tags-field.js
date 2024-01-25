module.exports.description = 'Add tags field';

module.exports.up = (migration) => {
  const events = migration.editContentType('events');
  events
    .createField('researchTags')
    .name('Research Tags')
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
};

module.exports.down = (migration) => {
  const events = migration.editContentType('events');
  events.deleteField('researchTags');
};