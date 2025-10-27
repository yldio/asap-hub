module.exports.description = 'Create project membership content model';

module.exports.up = function (migration) {
  const projectMembership = migration
    .createContentType('projectMembership')
    .name('Project Membership')
    .description('')
    .displayField('projectMember');

  projectMembership
    .createField('projectMember')
    .name('Project Member')
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
        // using dummy roles since we are yet to receive roles from the client
        in: [
          'Contributor',
          'Investigator',
          'Project CoLead',
          'Project Lead',
          'Project Manager',
        ],
      },
    ])
    .disabled(false)
    .omitted(false);

  projectMembership.changeFieldControl(
    'projectMember',
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
