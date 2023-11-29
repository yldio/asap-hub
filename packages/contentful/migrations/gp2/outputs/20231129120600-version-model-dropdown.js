module.exports.description = 'Add related outputs to outputs content model';

module.exports.up = (migration) => {
  const version = migration.editContentType('outputVersion');

  version.changeFieldControl('documentType', 'builtin', 'dropdown', {});
};

module.exports.down = (migration) => {
  migration
    .editContentType('outputVersion')
    .changeFieldControl('documentType', 'builtin', 'singleLine', {});
};
