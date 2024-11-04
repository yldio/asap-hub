module.exports.description = 'Add updated-by field';

module.exports.up = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');

  manuscriptVersions
    .createField('updatedBy')
    .name('Updated By')
    .type('Link')
    .localized(false)
    .required(false)
    .disabled(false)
    .omitted(false)
    .validations([
      {
        linkContentType: ['users'],
      },
    ])
    .linkType('Entry');

  manuscriptVersions.moveField('updatedBy').afterField('createdBy');
};

module.exports.down = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');
  manuscriptVersions.deleteField('updatedBy');
};
