module.exports.description = 'Add not applicable to quick checks';

module.exports.up = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');

  [
    'acknowledgedGrantNumber',
    'asapAffiliationIncluded',
    'manuscriptLicense',
    'datasetsDeposited',
    'codeDeposited',
    'protocolsDeposited',
    'labMaterialsRegistered',
    'availabilityStatement',
  ].forEach((field) => {
    manuscriptVersions.editField(field).validations([
      {
        in: ['Yes', 'No', 'Not applicable'],
      },
    ]);
  });
};

module.exports.down = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');

  [
    'acknowledgedGrantNumber',
    'asapAffiliationIncluded',
    'manuscriptLicense',
    'datasetsDeposited',
    'codeDeposited',
    'protocolsDeposited',
    'labMaterialsRegistered',
    'availabilityStatement',
  ].forEach((field) => {
    manuscriptVersions.editField(field).validations([
      {
        in: ['Yes', 'No'],
      },
    ]);
  });
};
