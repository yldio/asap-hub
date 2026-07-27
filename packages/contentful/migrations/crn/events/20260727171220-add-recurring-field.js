module.exports.description = 'Add recurring field';

module.exports.up = (migration) => {
  const events = migration.editContentType('events');

  events
    .createField('recurring')
    .name('Recurring')
    .type('Boolean')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  events.changeFieldControl('recurring', 'builtin', 'boolean', {
    helpText:
      'Set automatically from the calendar when the event is part of a recurring series. Manual changes are overwritten on the next sync.',
  });
};

module.exports.down = (migration) => {
  const events = migration.editContentType('events');
  events.deleteField('recurring');
};
