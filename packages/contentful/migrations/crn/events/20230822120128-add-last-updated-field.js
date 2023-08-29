module.exports.description = 'Adds last updated field';

module.exports.up = function (migration) {
  const events = migration.editContentType('events');
  events
    .createField('lastUpdated')
    .name('Last Updated')
    .type('Date')
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  events.changeFieldControl(
    'lastUpdated',
    'app',
    'v97H7wgmtstfxNheYWy0G', // last partial update app
    {
      // this is a hack, we dont want to exclude any field
      // but exclude is required
      exclude: '',
    },
  );
};

module.exports.down = (migration) => {
  const events = migration.editContentType('events');
  events.deleteField('lastUpdated');
};
