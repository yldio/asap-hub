module.exports.description = 'Add awards field to team membership';

module.exports.up = (migration) => {
  const teamMembership = migration.editContentType('teamMembership');
  teamMembership
    .createField('awards')
    .name('Awards')
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
          linkContentType: ['awards'],
        },
      ],

      linkType: 'Entry',
    });

  teamMembership.changeFieldControl('awards', 'builtin', 'entryLinksEditor', {
    bulkEditing: false,
    showLinkEntityAction: false,
    showCreateEntityAction: true,
  });
};

module.exports.down = (migration) => {
  const teamMembership = migration.editContentType('teamMembership');
  teamMembership.deleteField('awards');
};
