module.exports.description =
  'Ensure all Resource fields use team-resource-validation app for field control';

const APP_ID = '3OTn7DDwJPaUITZd6lFvZh';

module.exports.up = (migration) => {
  const teams = migration.editContentType('teams');

  // Ensure all Resource fields use our validation app
  // This will show validation warnings directly under each Resource field input
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
