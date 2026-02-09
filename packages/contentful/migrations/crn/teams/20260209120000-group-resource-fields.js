module.exports.description =
  'Group resource fields into a collapsible fieldset';

module.exports.up = (migration) => {
  const teams = migration.editContentType('teams');

  // Create editor layout with field groups
  const editorLayout = teams.createEditorLayout();

  // Create a fieldset for resource fields
  editorLayout.createFieldGroup('resourceGroup', {
    name: 'Resource Section',
  });

  // Change the field group control to be a collapsible fieldset
  editorLayout.changeFieldGroupControl('resourceGroup', 'builtin', 'fieldset', {
    helpText: 'Fields related to team resources',
    collapsedByDefault: false,
  });

  // Move resource fields into the group
  editorLayout
    .editFieldGroup('resourceGroup')
    .moveField('resourceTitle')
    .toTheTopOfFieldGroup();

  editorLayout
    .editFieldGroup('resourceGroup')
    .moveField('resourceDescription')
    .toTheBottomOfFieldGroup();

  editorLayout
    .editFieldGroup('resourceGroup')
    .moveField('resourceButtonCopy')
    .toTheBottomOfFieldGroup();

  editorLayout
    .editFieldGroup('resourceGroup')
    .moveField('resourceContactEmail')
    .toTheBottomOfFieldGroup();

  editorLayout
    .editFieldGroup('resourceGroup')
    .moveField('resourceLink')
    .toTheBottomOfFieldGroup();
};

module.exports.down = (migration) => {
  const teams = migration.editContentType('teams');
  teams.deleteEditorLayout();
};
