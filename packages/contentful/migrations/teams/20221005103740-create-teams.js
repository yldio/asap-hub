module.exports.description = 'Create content model for Teams';

module.exports.up = (migration) => {
  const teams = migration
    .createContentType('teams')
    .name('Teams')
    .displayField('id')
    .description('');

  teams.createField('id').name('ID').type('Symbol');

  teams.createField('displayName').name('Display Name').type('Symbol');

  teams
    .createField('outputs')
    .name('Shared Outputs')
    .type('Array')
    .items({
      type: 'Link',
      validations: [{ linkContentType: ['sharedOutputs'] }],
      linkType: 'Entry',
    });

  teams.changeFieldControl('id', 'builtin', 'singleLine');
  teams.changeFieldControl('displayName', 'builtin', 'singleLine');
  teams.changeFieldControl('outputs', 'builtin', 'entryLinksEditor');
};

module.exports.down = (migration) => migration.deleteContentType('teams');
