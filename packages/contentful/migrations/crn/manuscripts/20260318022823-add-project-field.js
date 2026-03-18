module.exports.description = 'Add optional Project field to manuscripts';

module.exports.up = (migration) => {
  const manuscripts = migration.editContentType('manuscripts');

  manuscripts
    .createField('project')
    .name('Project')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['projects'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');
};

module.exports.down = (migration) => {
  const manuscripts = migration.editContentType('manuscripts');
  manuscripts.deleteField('project');
};
