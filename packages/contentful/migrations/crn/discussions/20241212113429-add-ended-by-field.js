module.exports.description = 'Add ended-by field';

module.exports.up = (migration) => {
  const complianceReports = migration.editContentType('discussions');

  complianceReports
    .createField('endedBy')
    .name('Ended By')
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
  const complianceReports = migration.editContentType('discussions');
  complianceReports.deleteField('endedBy');
};
