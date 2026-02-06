module.exports.description =
  'Group resource fields together in teams content model';

module.exports.up = (migration) => {
  const teams = migration.editContentType('teams');

  // Edit the editor layout to create field groups (tabs)
  teams.configureEditorLayout((editorLayout) => {
    // Create a field group (tab) for resource-related fields
    editorLayout.createFieldGroup('resourceGroup', {
      name: 'Resource Section',
    });

    // Move resource fields into the group
    editorLayout
      .moveField('resourceTitle')
      .toTheTopOfFieldGroup('resourceGroup');
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
  });
};

module.exports.down = (migration) => {
  const teams = migration.editContentType('teams');

  // Edit the editor layout to remove the field group
  teams.configureEditorLayout((editorLayout) => {
    // Delete the field group (this will move fields back to default)
    editorLayout.deleteFieldGroup('resourceGroup');
  });
};
