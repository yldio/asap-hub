module.exports.description = 'Add Response to compliance report field';

module.exports.up = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');

  manuscriptVersions
    .createField('complianceReportResponse')
    .name('Response to compliance report')
    .type('Array')
    .localized(false)
    .required(false)
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkMimetypeGroup: ['pdfdocument', 'richtext'],
        },
      ],

      linkType: 'Asset',
    });

};

module.exports.down = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');
  manuscriptVersions.deleteField('complianceReportResponse');
};
