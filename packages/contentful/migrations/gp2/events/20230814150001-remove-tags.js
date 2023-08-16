module.exports.description = 'Remove tags from events content model';

module.exports.up = (migration) => {
  const events = migration.editContentType('events');

  events.deleteField('tags');
};

module.exports.down = (migration) => {
  migration
    .editContentType('events')
    .createField('tags')
    .name('Tags')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',
      validations: [],
    });
};
