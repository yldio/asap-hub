module.exports.description = 'Remove keywords from outputs content model';

module.exports.up = (migration) => {
  const outputs = migration.editContentType('outputs');

  outputs.deleteField('keywords');
  outputs.editField('tags').disabled(false);
};

module.exports.down = (migration) => {
  const outputs = migration.editContentType('outputs');

  outputs
    .createField('keywords')
    .name('Keywords')
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

  outputs.editField('tags').disabled(true);
};
