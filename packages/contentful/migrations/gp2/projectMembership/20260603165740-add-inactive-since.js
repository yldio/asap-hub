module.exports.description = 'Add inactiveSinceDate to projectMembership';

module.exports.up = (migration) => {
  const projectMembership = migration.editContentType('projectMembership');

  projectMembership
    .createField('inactiveSinceDate')
    .name('Inactive Since Date')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  projectMembership.changeFieldControl(
    'inactiveSinceDate',
    'builtin',
    'datePicker',
    {},
  );
};

module.exports.down = (migration) => {
  const projectMembership = migration.editContentType('projectMembership');
  projectMembership.deleteField('inactiveSinceDate');
};
