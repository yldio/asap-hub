module.exports.description =
  'Configure project membership role field to use custom app extension';

module.exports.up = function (migration) {
  const projectMembership = migration.editContentType('projectMembership');

  projectMembership.changeFieldControl(
    'role',
    'app',
    '3NyvjuxsjXSK0dEGyPiqSD',
    {},
  );
};

module.exports.down = (migration) => {
  const projectMembership = migration.editContentType('projectMembership');

  // Revert to built-in dropdown control
  projectMembership.changeFieldControl('role', 'builtin', 'dropdown', {});
};
