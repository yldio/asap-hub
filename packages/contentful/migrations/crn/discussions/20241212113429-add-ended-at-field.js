module.exports.description = 'Add ended-at field';

module.exports.up = (migration) => {
  const complianceReports = migration.editContentType('discussions');

  complianceReports
    .createField('endedAt')
    .name('Ended At')
    .type('Date')
    .localized(false)
    .required(false)
    .disabled(false)
    .omitted(false)
    .validations([]);
};

module.exports.down = (migration) => {
  const complianceReports = migration.editContentType('discussions');
  complianceReports.deleteField('endedAt');
};
