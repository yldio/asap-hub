module.exports.description =
  'Group resource fields into a collapsible fieldset';

module.exports.up = (migration) => {
  const teams = migration.editContentType('teams');

  // Create editor layout with field groups
  const editorLayout = teams.createEditorLayout();

  // Editor layout requires at least 2 groups
  // Create a main content group for general fields
  editorLayout.createFieldGroup('content', {
    name: 'Content',
  });

  // Create a fieldset for resource fields
  editorLayout.createFieldGroup('resourceGroup', {
    name: 'Resource Section',
  });

  // Change the resource group control to be a collapsible fieldset
  editorLayout.changeFieldGroupControl('resourceGroup', 'builtin', 'fieldset', {
    helpText: 'Fields related to team resources',
    collapsedByDefault: false,
  });

  // Move resource fields into the resource group
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
  editorLayout.moveField('resourceLink').toTheBottomOfFieldGroup('resourceGroup');
};

module.exports.down = (migration) => {
  const teams = migration.editContentType('teams');
  teams.deleteEditorLayout();
};
