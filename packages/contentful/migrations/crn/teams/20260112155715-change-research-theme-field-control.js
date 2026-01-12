module.exports.description =
  'Change researchTheme field control to use conditional-field-validation app';

module.exports.up = (migration) => {
  const teams = migration.editContentType('teams');

  teams.changeFieldControl('researchTheme', 'app', 'oXPp9wSsw0L6GzJS4yGkG', {});
};

module.exports.down = (migration) => {
  const teams = migration.editContentType('teams');

  teams.changeFieldControl('researchTheme', 'builtin', 'entryLinkEditor', {
    showLinkEntityAction: true,
    showCreateEntityAction: true,
  });
};
