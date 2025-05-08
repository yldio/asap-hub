module.exports.description =
  'Add Original Version ID field to Manuscript Version';

module.exports.up = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');
  manuscriptVersions
    .createField('originalVersionId')
    .name('Original Version Id')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  manuscriptVersions.changeFieldControl(
    'originalVersionId',
    'app',
    '2finDNk15g5UtOq4DaLNxv',
    {},
  );
};

module.exports.down = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');
  manuscriptVersions.deleteField('originalVersionId');
};
