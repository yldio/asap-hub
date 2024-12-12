module.exports.description = 'Add created-by field';

module.exports.up = (migration) => {
  const complianceReports = migration.editContentType('complianceReports');

  complianceReports
    .createField('createdBy')
    .name('Created By')
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
};

module.exports.down = (migration) => {
  const complianceReports = migration.editContentType('complianceReports');
  complianceReports.deleteField('createdBy');
};
