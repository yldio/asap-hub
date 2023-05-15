module.exports.description = 'Change field control for tokenDate to app';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');
  users.changeFieldControl(
    'orcidLastSyncDate',
    'app',
    '6en82KYFrsxlAIPqypMdOp',
    {
      observedField: 'orcid',
    },
  );
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');
  users.changeFieldControl('orcidLastSyncDate', 'builtin', 'datePicker', {});
};
