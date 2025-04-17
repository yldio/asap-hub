module.exports.description = 'Add APC Fields';

module.exports.up = (migration) => {
  const manuscripts = migration.editContentType('manuscripts');

  manuscripts
    .createField('apcRequested')
    .name('APC Requested?')
    .type('Boolean')
    .localized(false)
    .required(false)
    .validations([])
    .defaultValue({
      'en-US': false,
    })
    .disabled(false)
    .omitted(false);
  manuscripts
    .createField('apcPaid')
    .name('APC Paid?')
    .type('Boolean')
    .localized(false)
    .required(false)
    .validations([])
    .defaultValue({
      'en-US': false,
    })
    .disabled(false)
    .omitted(false);

  manuscripts
    .createField('apcAmount')
    .name('APC Amount')
    .type('Number')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(true)
    .omitted(false);

  manuscripts.changeFieldControl('apcRequested', 'builtin', 'boolean', {});
  manuscripts.changeFieldControl('apcPaid', 'builtin', 'boolean', {});
  manuscripts.changeFieldControl('apcAmount', 'builtin', 'numberEditor', {});
  manuscripts.moveField('apcRequested').afterField('previousStatus');
  manuscripts.moveField('apcPaid').afterField('apcRequested');
  manuscripts.moveField('apcAmount').afterField('apcPaid');
};

module.exports.down = (migration) => {
  const manuscripts = migration.editContentType('manuscripts');
  manuscripts.deleteField('apcRequested');
  manuscripts.deleteField('apcPaid');
  manuscripts.deleteField('apcAmount');
};
