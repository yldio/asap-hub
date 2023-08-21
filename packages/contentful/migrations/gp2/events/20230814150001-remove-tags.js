module.exports.description = 'Remove tags from events content model';

module.exports.up = (migration) => {
  const events = migration.editContentType('events');

  events.deleteField('tags');
  events.editField('keywords').disabled(false);
};

module.exports.down = (migration) => {
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
      type: 'Symbol',
      validations: [],
    });
  events.editField('keywords').disabled(true);
};
