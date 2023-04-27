module.exports.description = 'Create project membership content model';

module.exports.up = function (migration) {
  const projectMembership = migration
    .createContentType('projectMembership')
    .name('Project Membership')
    .description('')
    .displayField('role');

  projectMembership
    .createField('user')
    .name('user')
    .type('Link')
    .localized(false)
    .required(true)
    .validations([
      {
        linkContentType: ['users'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  projectMembership
    .createField('role')
    .name('Role')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        in: [
          'Contributor',
          'Investigator',
          'Project_CoLead',
          'Project_Lead',
          'Project_Manager',
        ],
      },
    ])
    .disabled(false)
    .omitted(false);

  projectMembership.changeFieldControl('user', 'builtin', 'entryLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });

  projectMembership.changeFieldControl('role', 'builtin', 'dropdown', {});
};

module.exports.down = (migration) => {
  migration.deleteContentType('projectMembership');
};
