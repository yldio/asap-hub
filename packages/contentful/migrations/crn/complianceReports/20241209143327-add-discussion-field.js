module.exports.description = '<Put your description here>';

module.exports.up = (migration) => {
  const complianceReports = migration.editContentType('complianceReports');

  complianceReports
    .createField('discussion')
    .name('Discussion')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['discussions'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');
};

module.exports.down = (migration) => {
  const complianceReports = migration.editContentType('complianceReports');
  complianceReports.deleteField('discussion');
};
