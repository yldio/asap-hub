module.exports.description =
  'Add status updated by, updated at and previous status fields';

module.exports.up = (migration) => {
  const manuscripts = migration.editContentType('manuscripts');

  manuscripts
    .createField('statusUpdatedBy')
    .name('Status Updated By')
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

  manuscripts
    .createField('statusUpdatedAt')
    .name('Status Updated At')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  manuscripts
    .createField('previousStatus')
    .name('Previous Status')
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
  manuscripts.moveField('statusUpdatedBy').afterField('status');
  manuscripts.moveField('statusUpdatedAt').afterField('statusUpdatedBy');
  manuscripts.moveField('previousStatus').afterField('statusUpdatedAt');
};

module.exports.down = (migration) => {
  const manuscripts = migration.editContentType('manuscripts');
  manuscripts.deleteField('statusUpdatedBy');
  manuscripts.deleteField('statusUpdatedAt');
  manuscripts.deleteField('previousStatus');
};
