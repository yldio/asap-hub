module.exports.description = 'Add attendance model';

module.exports.up = (migration) => {
  const attendance = migration
    .createContentType('attendance')
    .name('Attendance')
    .description('');

  attendance
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

  attendance
    .createField('attended')
    .name('Attended')
    .type('Boolean')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  attendance.changeFieldControl('team', 'builtin', 'entryLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });

  attendance.changeFieldControl('attended', 'builtin', 'boolean', {});
};

module.exports.down = (migration) => {
  migration.deleteContentType('attendance');
};
