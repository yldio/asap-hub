module.exports.description = 'Create project membership content model';

module.exports.up = function (migration) {
  const projectMembership = migration
    .createContentType('projectMembership')
    .name('Project Membership')
    .description('')
    .displayField('member');

  projectMembership
    .createField('member')
    .name('Member')
    .type('Link')
    .localized(false)
    .required(true)
    .validations([
      {
        linkContentType: ['users', 'teams'],
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
    .required(false)
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

  projectMembership.changeFieldControl(
    'memberName',
    'builtin',
    'entryLinkEditor',
    {
      showLinkEntityAction: true,
      showCreateEntityAction: false,
    },
  );
};

module.exports.down = (migration) => {
  migration.deleteContentType('projectMembership');
};
