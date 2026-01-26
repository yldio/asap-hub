module.exports.description =
  'Change Resource fields field control to use team-resource-validation app';

const APP_ID = '3OTn7DDwJPaUITZd6lFvZh';

module.exports.up = (migration) => {
  const teams = migration.editContentType('teams');

  // Change field controls for Resource fields to use our validation app
  // This will show warnings directly under each Resource field input
  // Explicitly clear helpText to remove any existing help text
  teams.changeFieldControl('resourceTitle', 'app', APP_ID, { helpText: '' });
  teams.changeFieldControl('resourceDescription', 'app', APP_ID, {
    helpText: '',
  });
  teams.changeFieldControl('resourceButtonCopy', 'app', APP_ID, {
    helpText: '',
  });
  teams.changeFieldControl('resourceContactEmail', 'app', APP_ID, {
    helpText: '',
  });
};

module.exports.down = (migration) => {
  const teams = migration.editContentType('teams');

  // Revert to builtin field controls
  teams.changeFieldControl('resourceTitle', 'builtin', 'singleLine');
  teams.changeFieldControl('resourceDescription', 'builtin', 'multipleLine');
  teams.changeFieldControl('resourceButtonCopy', 'builtin', 'singleLine');
  teams.changeFieldControl('resourceContactEmail', 'builtin', 'singleLine');
};
