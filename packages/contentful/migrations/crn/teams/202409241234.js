module.exports.description = 'Add Research Theme to Teams';

module.exports.up = (migration) => {
  const researchTheme = migration
    .createContentType('researchTheme')
    .name('Research Theme')
    .description('')
    .displayField('name');

  researchTheme
    .createField('name')
    .name('Name')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  const teams = migration.editContentType('teams');

  teams
    .createField('researchTheme')
    .name('Research Theme')
    .type('Link')
    .localized(false)
    .validations([
      {
        linkContentType: ['researchTheme'],
        message: 'Only entries from Research Theme model can be selected.',
      },
    ])

    .required(false)
    .disabled(false)
    .omitted(false)
    .linkType('Entry');
};

module.exports.down = (migration) => {
  const teams = migration.editContentType('teams');
  teams.deleteField('researchTheme');

  migration.deleteContentType('researchTheme');
};
