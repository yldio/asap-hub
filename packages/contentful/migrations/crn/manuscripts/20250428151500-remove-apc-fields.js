module.exports.description = 'Remove APC fields from manuscript versions';

module.exports.up = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');
  manuscriptVersions.deleteField('requestingApcCoverage');
  manuscriptVersions.deleteField('submitterName');
  manuscriptVersions.deleteField('submissionDate');
};

module.exports.down = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');

  manuscriptVersions
    .createField('requestingApcCoverage')
    .name('Requesting APC Coverage')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        in: ['Yes', 'No', 'Already submitted'],
      },
    ])
    .disabled(false)
    .omitted(false);

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
};
