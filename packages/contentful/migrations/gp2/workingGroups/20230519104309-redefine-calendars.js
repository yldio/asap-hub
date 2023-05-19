module.exports.description = 'Updates role';

module.exports.up = (migration) => {
  const workingGroups = migration.editContentType('workingGroups');

  workingGroups
    .createField('calendar')
    .name('Calendar')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['calendars'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  workingGroups.moveField('calendar').afterField('description');
  workingGroups.changeFieldControl('calendar', 'builtin', 'entryLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });
  workingGroups.deleteField('calendars');
};

module.exports.down = (migration) => {
  const workingGroups = migration.editContentType('workingGroups');
  workingGroups.deleteField('calendar');
};
