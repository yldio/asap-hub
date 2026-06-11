module.exports.description =
  'Add inactiveSinceDate field to workingGroupMembership';

module.exports.up = (migration) => {
  const workingGroupMembership = migration.editContentType(
    'workingGroupMembership',
  );

  workingGroupMembership
    .createField('inactiveSinceDate')
    .name('Inactive Since')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
};

module.exports.down = (migration) => {
  const workingGroupMembership = migration.editContentType(
    'workingGroupMembership',
  );
  workingGroupMembership.deleteField('inactiveSinceDate');
};
