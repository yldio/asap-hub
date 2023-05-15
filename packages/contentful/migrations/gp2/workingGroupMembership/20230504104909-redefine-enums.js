module.exports.description = 'Updates enums';

module.exports.up = (migration) => {
  const workingGroupMembership = migration.editContentType(
    'workingGroupMembership',
  );

  workingGroupMembership.editField('role').validations([
    {
      in: ['Lead', 'Co-lead', 'Working group member'],
    },
  ]);
};

module.exports.down = (migration) => {
  const workingGroupMembership = migration.editContentType(
    'workingGroupMembership',
  );
  workingGroupMembership.editField('role').items({
    type: 'Symbol',
    validations: [
      {
        in: [],
      },
    ],
  });
};
