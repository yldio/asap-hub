module.exports.description = 'Add Response to compliance report field';

module.exports.up = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');

  manuscriptVersions
    .createField('complianceReportResponse')
    .name('Response to compliance report')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkMimetypeGroup: ['pdfdocument', 'richtext'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Asset');
};

module.exports.down = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');
  manuscriptVersions.deleteField('complianceReportResponse');
};
