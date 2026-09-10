module.exports.description = 'Add interest group link to attendance';

module.exports.up = (migration) => {
  const attendance = migration.editContentType('attendance');

  attendance
    .createField('interestGroup')
    .name('Interest Group')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['interestGroups'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  attendance.changeFieldControl('interestGroup', 'builtin', 'entryLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });
};

module.exports.down = (migration) => {
  const attendance = migration.editContentType('attendance');
  attendance.deleteField('interestGroup');
};
