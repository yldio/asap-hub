module.exports.description = 'Remove tags field';

module.exports.up = (migration) => {
  const entity = migration.editContentType('events');
  entity.deleteField('tags');
};

module.exports.down = (migration) => {
  const entity = migration.editContentType('events');

  entity
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
