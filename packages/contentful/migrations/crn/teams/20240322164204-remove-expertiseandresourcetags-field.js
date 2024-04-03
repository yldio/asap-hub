module.exports.description = 'Remove expertiseAndResourceTags field';

module.exports.up = (migration) => {
  const entity = migration.editContentType('teams');
  entity.deleteField('expertiseAndResourceTags');
};

module.exports.down = (migration) => {
  const entity = migration.editContentType('teams');

  entity
    .createField('expertiseAndResourceTags')
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
