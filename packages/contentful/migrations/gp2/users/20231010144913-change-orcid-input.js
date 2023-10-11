module.exports.description = 'Revert field control back to single line text';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');

  users.changeFieldControl('orcid', 'builtin', 'singleLine', {
    helpText: 'ORCID must have the following format: 0000-0000-0000-0000',
  });
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');

  users.changeFieldControl('orcid', 'builtin', 'urlEditor', {
    helpText:
      'ORCID url should follow the pattern: https://orcid.org/<ORCID>. ORCID must have the following format: 0000-0000-0000-0000',
  });
};
