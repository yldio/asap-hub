module.exports.description =
  'Change endDate and resourceType field controls to use conditional-field-validation app';

module.exports.up = (migration) => {
  const projects = migration.editContentType('projects');

  projects.changeFieldControl('endDate', 'app', 'oXPp9wSsw0L6GzJS4yGkG', {
    format: 'dateonly',
    ampm: '24',
  });
  projects.changeFieldControl(
    'resourceType',
    'app',
    'oXPp9wSsw0L6GzJS4yGkG',
    {},
  );
};

module.exports.down = (migration) => {
  const projects = migration.editContentType('projects');

  projects.changeFieldControl('endDate', 'builtin', 'datePicker', {
    ampm: '24',
    format: 'dateonly',
  });
  projects.changeFieldControl('resourceType', 'builtin', 'entryLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: false,
  });
};
