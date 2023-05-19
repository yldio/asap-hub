module.exports.description = 'Updates role';

module.exports.up = (migration) => {
  const contributingCohortsMembership = migration.editContentType(
    'contributingCohortsMembership',
  );

  contributingCohortsMembership.editField('role').validations([
    {
      in: ['Investigator', 'Lead Investigator', 'Co-Investigator'],
    },
  ]);
};

module.exports.down = (migration) => {
  const contributingCohortsMembership = migration.editContentType(
    'contributingCohortsMembership',
  );
  contributingCohortsMembership.editField('role').items({
    type: 'Symbol',
    validations: [
      {
        in: [],
      },
    ],
  });
};
