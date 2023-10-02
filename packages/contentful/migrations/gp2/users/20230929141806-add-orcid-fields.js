module.exports.description = '<Put your description here>';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');

  users
    .createField('orcidLastSyncDate')
    .name('ORCID Last Sync Date')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  users.changeFieldControl(
    'orcidLastSyncDate',
    'app',
    '6en82KYFrsxlAIPqypMdOp',
    {
      observedField: 'orcid',
    },
  );

  users
    .createField('orcidLastModifiedDate')
    .name('ORCID Last Modified Date')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  users
    .createField('orcidWorks')
    .name('Orcid Works')
    .type('Object')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  users.changeFieldControl('orcidWorks', 'app', '2finDNk15g5UtOq4DaLNxv', {});

  users.moveField('orcidLastSyncDate').afterField('orcid');
  users.moveField('orcidLastModifiedDate').afterField('orcidLastSyncDate');
  users.moveField('orcidWorks').afterField('orcidLastModifiedDate');
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');
  users.deleteField('orcidWorks');
  users.deleteField('orcidLastModifiedDate');
  users.deleteField('orcidLastSyncDate');
};
