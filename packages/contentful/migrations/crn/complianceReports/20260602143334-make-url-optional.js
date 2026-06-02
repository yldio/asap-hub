module.exports.description = 'Make URL field optional on Compliance Reports';

module.exports.up = (migration) => {
  const complianceReports = migration.editContentType('complianceReports');
  complianceReports.editField('url').required(false);
};

module.exports.down = (migration) => {
  const complianceReports = migration.editContentType('complianceReports');
  complianceReports.editField('url').required(true);
};
