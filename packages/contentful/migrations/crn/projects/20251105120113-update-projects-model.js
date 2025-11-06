module.exports.description = 'Update projects model';

module.exports.up = (migration) => {
  const projects = migration.editContentType('projects');

  projects
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

  projects.editField('endDate').required(false);

  projects.changeFieldControl('proposal', 'builtin', 'entryLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });

  projects.moveField('proposal').afterField('originalGrant');
};

module.exports.down = (migration) => {
  const projects = migration.editContentType('projects');

  projects.deleteField('proposal');
  projects.editField('endDate').required(true);
};
