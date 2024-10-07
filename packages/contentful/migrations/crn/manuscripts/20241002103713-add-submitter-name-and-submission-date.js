module.exports.description =
  'Add submitters name and submission date to manuscript versions';

module.exports.up = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');

  manuscriptVersions
    .createField('submitterName')
    .name("Submitter's Name")
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  manuscriptVersions
    .createField('submissionDate')
    .name('Submission Date')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  manuscriptVersions
    .moveField('submitterName')
    .afterField('requestingApcCoverage');
  manuscriptVersions.moveField('submissionDate').afterField('submitterName');
};

module.exports.down = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');
  manuscriptVersions.deleteField('submitterName');
  manuscriptVersions.deleteField('submissionDate');
};
