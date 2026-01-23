module.exports.description =
  'Rename projectMember and role fields for better clarity';

module.exports.up = function (migration) {
  const projectMembership = migration.editContentType('projectMembership');

  // Rename projectMember field
  projectMembership
    .editField('projectMember')
    .name('Project Member (User or Team)');

  // Rename role field
  projectMembership.editField('role').name('User Role');
};

module.exports.down = (migration) => {
  const projectMembership = migration.editContentType('projectMembership');

  // Revert projectMember field name
  projectMembership.editField('projectMember').name('Project Member');

  // Revert role field name
  projectMembership.editField('role').name('Role');
};
