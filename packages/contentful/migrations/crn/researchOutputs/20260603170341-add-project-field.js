module.exports.description = 'Add Project field to research outputs';

module.exports.up = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');

  researchOutputs
    .createField('project')
    .name('Project')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['projects'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  researchOutputs.changeFieldControl('project', 'builtin', 'entryLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });

  researchOutputs.moveField('project').afterField('teams');
};

module.exports.down = (migration) => {
  const researchOutputs = migration.editContentType('researchOutputs');
  researchOutputs.deleteField('project');
};
