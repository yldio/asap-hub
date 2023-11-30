module.exports.description =
  'Change documentType field editor in output version';

module.exports.up = (migration) => {
  const version = migration.editContentType('outputVersion');

  version.changeFieldControl('documentType', 'builtin', 'dropdown', {});
};

module.exports.down = (migration) => {
  migration
    .editContentType('outputVersion')
    .changeFieldControl('documentType', 'builtin', 'singleLine', {});
};
