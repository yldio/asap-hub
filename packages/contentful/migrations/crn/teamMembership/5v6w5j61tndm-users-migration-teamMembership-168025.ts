module.exports.description = 'Create team membership content model';

module.exports.up = function (migration) {
  const teamMembership = migration
    .createContentType('teamMembership')
    .name('TeamMembership')
    .description('')
    .displayField('role');

  teamMembership
    .createField('team')
    .name('Team')
    .type('Link')
    .localized(false)
    .required(true)
    .validations([
      {
        linkContentType: ['teams'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  teamMembership
    .createField('role')
    .name('Role')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        in: [
          'Lead PI (Core Leadership)',
          'Co-PI (Core Leadership)',
          'Project Manager',
          'Collaborating PI',
          'Key Personnel',
          'ASAP Staff',
          'Scientific Advisory Board',
        ],
      },
    ])
    .disabled(false)
    .omitted(false);

  teamMembership
    .createField('inactiveSinceDate')
    .name('Inactive Since')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  teamMembership.changeFieldControl('team', 'builtin', 'entryLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });

  teamMembership.changeFieldControl('role', 'builtin', 'dropdown', {});
  teamMembership.changeFieldControl(
    'inactiveSinceDate',
    'builtin',
    'datePicker',
    {},
  );
};

module.exports.down = (migration) => {
  migration.deleteContentType('teamMembership');
};
