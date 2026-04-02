module.exports.description = 'Add Scientific Facilitator field to projects';

module.exports.up = (migration) => {
  const projects = migration.editContentType('projects');

  projects
    .createField('scientificFacilitator')
    .name('Scientific Facilitator')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',
      validations: [
        {
          linkContentType: ['users'],
        },
      ],
      linkType: 'Entry',
    });

  projects.changeFieldControl(
    'scientificFacilitator',
    'builtin',
    'entryLinksEditor',
    {
      showLinkEntityAction: true,
      showCreateEntityAction: false,
    },
  );

  projects.moveField('scientificFacilitator').afterField('members');
};

module.exports.down = (migration) => {
  const projects = migration.editContentType('projects');
  projects.deleteField('scientificFacilitator');
};
