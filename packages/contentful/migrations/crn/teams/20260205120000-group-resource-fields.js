module.exports.description =
  'Group resource fields together in teams content model';

module.exports.up = (migration) => {
  const teams = migration.editContentType('teams');

  // Create a field group for resource-related fields
  teams.createFieldGroup('resourceGroup', {
    name: 'Resource Section',
  });

  // Move resource fields into the group
  teams.moveField('resourceTitle').toTheTopOfFieldGroup('resourceGroup');
  teams.moveField('resourceDescription').toTheBottomOfFieldGroup('resourceGroup');
  teams.moveField('resourceButtonCopy').toTheBottomOfFieldGroup('resourceGroup');
  teams.moveField('resourceContactEmail').toTheBottomOfFieldGroup('resourceGroup');
  teams.moveField('resourceLink').toTheBottomOfFieldGroup('resourceGroup');
};

module.exports.down = (migration) => {
  const teams = migration.editContentType('teams');

  // Move fields out of the group (back to the root level)
  teams.moveField('resourceTitle').toTheTop();
  teams.moveField('resourceDescription').toTheTop();
  teams.moveField('resourceButtonCopy').toTheTop();
  teams.moveField('resourceContactEmail').toTheTop();
  teams.moveField('resourceLink').toTheTop();

  // Delete the field group
  teams.deleteFieldGroup('resourceGroup');
};
