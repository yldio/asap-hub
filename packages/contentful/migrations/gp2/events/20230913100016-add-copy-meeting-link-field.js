module.exports.description = 'Add copy meeting link field';

module.exports.up = (migration) => {
  const events = migration.editContentType('events');

  events
    .createField('copyMeetingLink')
    .name('Copy meeting link')
    .type('Boolean')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  events.changeFieldControl('copyMeetingLink', 'builtin', 'boolean', {
    helpText: 'Copy meeting link to all series events',
    trueLabel: 'Yes',
    falseLabel: 'No',
  });

  events.moveField('copyMeetingLink').afterField('meetingLink');
};

module.exports.down = (migration) => {
  const events = migration.editContentType('events');
  events.deleteField('copyMeetingLink');
};
