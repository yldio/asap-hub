module.exports.description = 'Add status to manuscript';

module.exports.up = (migration) => {
  const manuscript = migration.editContentType('manuscripts');

  manuscript
    .createField('status')
    .name('Status')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        in: [
          'Waiting for Report',
          'Review Compliance Report',
          'Waiting for ASAP Reply',
          "Waiting for Grantee's Reply",
          'Manuscript Resubmitted',
          'Submit Final Publication',
          'Addendum Required',
          'Compliant',
          'Closed (other)',
        ],
      },
    ])
    .disabled(false)
    .omitted(false);
};

module.exports.down = (migration) => {
  const manuscript = migration.editContentType('manuscripts');
  manuscript.deleteField('status');
};
