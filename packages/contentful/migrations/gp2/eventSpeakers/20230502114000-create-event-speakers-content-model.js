module.exports.description = 'Create event speakers content model';

module.exports.up = (migration) => {
  const eventSpeakers = migration
    .createContentType('eventSpeakers')
    .name('Event Speakers')
    .description('')
    .displayField('title');
  eventSpeakers
    .createField('title')
    .name('Title')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  eventSpeakers
    .createField('user')
    .name('User')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['externalUsers', 'users'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  eventSpeakers.changeFieldControl(
    'title',
    'app',
    '6ZkXISzhv1b7jjgyaK2piv',
    {},
  );
  eventSpeakers.changeFieldControl('user', 'builtin', 'entryLinkEditor', {});
  eventSpeakers.changeFieldControl('title', 'builtin', 'singleLine', {});
};

module.exports.down = (migration) => {
  migration.deleteContentType('eventSpeakers');
};
