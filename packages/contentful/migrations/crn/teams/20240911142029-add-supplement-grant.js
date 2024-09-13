module.exports.description = 'Add supplement grant field';

module.exports.up = (migration) => {
  const teams = migration.editContentType('teams');

  teams
    .createField('supplementGrant')
    .name('Supplement Grant')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['supplementGrant'],
        message: 'Only entries from Supplement Grant model can be selected.',
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');
  teams.changeFieldControl('supplementGrant', 'builtin', 'entryCardEditor', {});
};

module.exports.down = (migration) => {
  const teams = migration.editContentType('teams');
  teams.deleteField('supplementGrant');
};
