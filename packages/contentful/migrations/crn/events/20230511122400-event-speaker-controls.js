module.exports.description = 'Create events content model';

module.exports.up = (migration) => {
  const events = migration.editContentType('events');

  events.changeFieldControl('speakers', 'app', '6ZkXISzhv1b7jjgyaK2piv', {});

  const eventSpeakers = migration.editContentType('eventSpeakers');

  eventSpeakers.displayField('team');

  eventSpeakers.deleteField('title');
};

module.exports.down = (migration) => {
  const eventSpeakers = migration.editContentType('eventSpeakers');

  eventSpeakers
    .createField('title')
    .name('Title')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  eventSpeakers.changeFieldControl(
    'title',
    'app',
    '6ZkXISzhv1b7jjgyaK2piv',
    {},
  );
};
