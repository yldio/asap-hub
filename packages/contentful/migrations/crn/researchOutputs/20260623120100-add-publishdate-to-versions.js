module.exports.description =
  'Add Publish Date field to research output versions';

module.exports.up = (migration) => {
  const researchOutputVersions = migration.editContentType(
    'researchOutputVersions',
  );

  researchOutputVersions
    .createField('publishDate')
    .name('Publish Date')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  researchOutputVersions.moveField('publishDate').afterField('addedDate');
};

module.exports.down = (migration) => {
  const researchOutputVersions = migration.editContentType(
    'researchOutputVersions',
  );
  researchOutputVersions.deleteField('publishDate');
};
