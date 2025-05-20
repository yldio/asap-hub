module.exports.description =
  'Add APC fields and rename apcAmount to apcAmountPaid on Manuscript model';

module.exports.up = (migration) => {
  const manuscript = migration.editContentType('manuscripts');

  manuscript
    .createField('apcCoverageRequestStatus')
    .name('APC Coverage Request Status')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([{ in: ['notPaid', 'paid', 'declined'] }])
    .disabled(false)
    .omitted(false);

  manuscript
    .createField('declinedReason')
    .name('Declined Reason')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([{ size: { max: 100 } }])
    .disabled(false)
    .omitted(false);

  manuscript
    .createField('apcAmountRequested')
    .name('APC Amount Requested')
    .type('Number')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  manuscript
    .createField('apcAmountPaid')
    .name('APC Amount Paid')
    .type('Number')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  // Note: No data migration is required. The field apcAmount was unused.
  manuscript.deleteField('apcAmount');
};

module.exports.down = (migration) => {
  const manuscript = migration.editContentType('manuscripts');

  manuscript.deleteField('apcCoverageRequestStatus');
  manuscript.deleteField('declinedReason');
  manuscript.deleteField('apcAmountRequested');
  manuscript.deleteField('apcAmountPaid');

  manuscript
    .createField('apcAmount')
    .name('APC Amount')
    .type('Number')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
};
