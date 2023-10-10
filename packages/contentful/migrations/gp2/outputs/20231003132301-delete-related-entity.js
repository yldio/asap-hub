module.exports.description = 'Remove related entity from outputs content model';

module.exports.up = (migration) => {
  const outputs = migration.editContentType('outputs');

  outputs.deleteField('relatedEntity');
};

module.exports.down = (migration) => {
  migration
    .editContentType('outputs')
    .createField('relatedEntity')
    .name('Related Entity')
    .type('Link')
    .localized(false)
    .required(true)
    .validations([
      {
        linkContentType: ['projects', 'workingGroups'],
      },
    ])
    .disabled(true)
    .omitted(false)
    .linkType('Entry');
};
