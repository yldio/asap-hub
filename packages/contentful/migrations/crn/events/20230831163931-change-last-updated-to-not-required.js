module.exports.description = 'Change last updated to not required';

module.exports.up = function (migration) {
  const events = migration.editContentType('events');
  events.editField('lastUpdated').required(false);
};

module.exports.down = (migration) => {
  const events = migration.editContentType('events');
  events.editField('lastUpdated').required(true);
};
