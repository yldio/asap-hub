module.exports.description = 'Add help texts copied from Squidex';

module.exports.up = (migration) => {
  const events = migration.editContentType('events');

  events.changeFieldControl(
    'presentationPermanentlyUnavailable',
    'builtin',
    'boolean',
    {
      helpText:
        "This box is automatically ticked if no output is added after 14 days from the event's end date.",
      trueLabel: 'Yes',
      falseLabel: 'No',
    },
  );

  events.changeFieldControl('startDate', 'app', '2finDNk15g5UtOq4DaLNxv', {
    helpText: 'if you want to edit this, go to google cal',
  });

  events.changeFieldControl('endDate', 'app', '2finDNk15g5UtOq4DaLNxv', {
    helpText: 'if you want to edit this, go to google cal',
  });

  events.changeFieldControl('description', 'app', '2finDNk15g5UtOq4DaLNxv', {
    helpText: 'if you want to edit this, go to google cal',
  });

  events.changeFieldControl('title', 'app', '2finDNk15g5UtOq4DaLNxv', {
    helpText: 'if you want to edit this, go to google cal',
  });
};

module.exports.down = (migration) => {
  const events = migration.editContentType('events');

  events.changeFieldControl(
    'presentationPermanentlyUnavailable',
    'builtin',
    'boolean',
    {},
  );

  events.changeFieldControl('startDate', 'app', '2finDNk15g5UtOq4DaLNxv', {});

  events.changeFieldControl('endDate', 'app', '2finDNk15g5UtOq4DaLNxv', {});

  events.changeFieldControl('description', 'app', '2finDNk15g5UtOq4DaLNxv', {});

  events.changeFieldControl('title', 'app', '2finDNk15g5UtOq4DaLNxv', {});
};
