module.exports.description = 'Updates projects';

module.exports.up = (migration) => {
  const projects = migration.editContentType('projects');

  projects
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

  projects.moveField('calendar').afterField('endDate');
  projects.changeFieldControl('calendar', 'builtin', 'entryLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });
  projects.deleteField('calendars');
};

module.exports.down = (migration) => {
  const projects = migration.editContentType('projects');
};
