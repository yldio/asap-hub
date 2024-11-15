module.exports.description = 'Add count field';

module.exports.up = (migration) => {
  const complianceReports = migration.editContentType('complianceReports');

  complianceReports
    .createField('count')
    .name('Count')
    .type('Integer')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);
};

module.exports.down = (migration) => {
  const complianceReports = migration.editContentType('complianceReports');

  complianceReports.deleteField('count');
};
