module.exports.description =
  'Group resource fields into a collapsible fieldset';

module.exports.up = (migration) => {
  const teams = migration.editContentType('teams');
  const editorLayout = teams.createEditorLayout();

  // Create two top-level tabs (minimum 2 required)
  editorLayout.createFieldGroup('content', { name: 'Content' });
  editorLayout.changeFieldGroupControl('content', 'builtin', 'topLevelTab');

  editorLayout.createFieldGroup('resources', { name: 'Resources' });
  editorLayout.changeFieldGroupControl('resources', 'builtin', 'topLevelTab');

  // Create nested fieldset inside resources tab
  editorLayout
    .editFieldGroup('resources')
    .createFieldGroup('resourceDetails', { name: 'Resource Details' });
  editorLayout.changeFieldGroupControl(
    'resourceDetails',
    'builtin',
    'fieldset',
    {
      collapsedByDefault: false,
    },
  );

  // Move resource fields into the nested fieldset
  editorLayout
    .moveField('resourceTitle')
    .toTheTopOfFieldGroup('resourceDetails');
  editorLayout
    .moveField('resourceDescription')
    .toTheBottomOfFieldGroup('resourceDetails');
  editorLayout
    .moveField('resourceButtonCopy')
    .toTheBottomOfFieldGroup('resourceDetails');
  editorLayout
    .moveField('resourceContactEmail')
    .toTheBottomOfFieldGroup('resourceDetails');
  editorLayout
    .moveField('resourceLink')
    .toTheBottomOfFieldGroup('resourceDetails');
};

module.exports.down = (migration) => {
  const teams = migration.editContentType('teams');
  teams.deleteEditorLayout();
};
