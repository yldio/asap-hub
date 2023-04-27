module.exports.description = 'Create working group membership content model';

module.exports.up = function (migration) {
  const workingGroupMembership = migration
    .createContentType('workingGroupMembership')
    .name('Working Group Membership')
    .description('')
    .displayField('role');

  workingGroupMembership
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

  workingGroupMembership
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

  workingGroupMembership.changeFieldControl(
    'user',
    'builtin',
    'entryLinkEditor',
    {
      showLinkEntityAction: true,
      showCreateEntityAction: false,
    },
  );

  workingGroupMembership.changeFieldControl('role', 'builtin', 'dropdown', {});
};

module.exports.down = (migration) => {
  migration.deleteContentType('workingGroupMembership');
};
