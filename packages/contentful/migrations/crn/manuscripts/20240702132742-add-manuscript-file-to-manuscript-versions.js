module.exports.description = '<Put your description here>';

module.exports.up = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');

  manuscriptVersions
    .createField('manuscriptFile')
    .name('Manuscript File')
    .type('Link')
    .localized(false)
    .required(true)
    .validations([
      {
        linkMimetypeGroup: ['application/pdf'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Asset');
};

module.exports.down = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptFile');
  manuscriptVersions.deleteField('createdBy');
};
