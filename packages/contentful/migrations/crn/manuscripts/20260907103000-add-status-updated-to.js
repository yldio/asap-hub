module.exports.description = 'Add status updated to field';

module.exports.up = (migration) => {
  const manuscripts = migration.editContentType('manuscripts');

  manuscripts
    .createField('statusUpdatedTo')
    .name('Status Updated To')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        in: [
          'Waiting for Report',
          'Review Compliance Report',
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

  manuscripts.moveField('statusUpdatedTo').afterField('previousStatus');
};

module.exports.down = (migration) => {
  const manuscripts = migration.editContentType('manuscripts');
  manuscripts.deleteField('statusUpdatedTo');
};
