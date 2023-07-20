module.exports.description = 'Add proposal field';

module.exports.up = (migration) => {
  const teams = migration.editContentType('teams');

  teams
    .createField('proposal')
    .name('Proposal')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['researchOutputs'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  teams.changeFieldControl('proposal', 'builtin', 'entryLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });
};

module.exports.down = (migration) => {
  const teams = migration.editContentType('teams');

  teams.deleteField('proposal');
};
