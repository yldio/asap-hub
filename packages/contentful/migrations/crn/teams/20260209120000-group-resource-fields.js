module.exports.description =
  'Group resource fields into a collapsible fieldset';

module.exports.up = (migration) => {
  const teams = migration.editContentType('teams');
  const editorLayout = teams.createEditorLayout();

  // Top-level groups MUST be topLevelTab - this is Contentful's requirement
  editorLayout.createFieldGroup('main', { name: 'Team Details' });
  editorLayout.changeFieldGroupControl('main', 'builtin', 'topLevelTab');

  // Create a nested fieldset INSIDE the main tab for resources
  // Fieldsets can only exist nested inside a topLevelTab
  editorLayout
    .editFieldGroup('main')
    .createFieldGroup('resourceGroup', { name: 'Resource Section' });
  editorLayout.changeFieldGroupControl('resourceGroup', 'builtin', 'fieldset', {
    helpText: 'Fields related to team resources',
    collapsedByDefault: false,
  });

  // Move resource fields into the nested fieldset
  editorLayout.moveField('resourceTitle').toTheTopOfFieldGroup('resourceGroup');
  editorLayout
    .moveField('resourceDescription')
    .toTheBottomOfFieldGroup('resourceGroup');
  editorLayout
    .moveField('resourceButtonCopy')
    .toTheBottomOfFieldGroup('resourceGroup');
  editorLayout
    .moveField('resourceContactEmail')
    .toTheBottomOfFieldGroup('resourceGroup');
  editorLayout
    .moveField('resourceLink')
    .toTheBottomOfFieldGroup('resourceGroup');
};

module.exports.down = (migration) => {
  const teams = migration.editContentType('teams');
  teams.deleteEditorLayout();
};
