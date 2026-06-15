module.exports.description =
  'Add inactiveSinceDate field to GP2 workingGroupMembership';

module.exports.up = (migration) => {
  const workingGroupMembership = migration.editContentType(
    'workingGroupMembership',
  );

  workingGroupMembership
    .createField('inactiveSinceDate')
    .name('Inactive Since Date')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  workingGroupMembership.changeFieldControl(
    'inactiveSinceDate',
    'builtin',
    'datePicker',
    {},
  );
};

module.exports.down = (migration) => {
  const workingGroupMembership = migration.editContentType(
    'workingGroupMembership',
  );
  workingGroupMembership.deleteField('inactiveSinceDate');
};
