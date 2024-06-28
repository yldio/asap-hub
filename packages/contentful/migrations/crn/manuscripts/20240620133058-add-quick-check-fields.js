module.exports.description = 'Add quick check fields';

module.exports.up = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');

  [
    {
      field: 'acknowledgedGrantNumber',
      name: 'Included your grant number?',
    },
    {
      field: 'asapAffiliationIncluded',
      name: 'ASAP Affiliation Included?',
    },
    {
      field: 'manuscriptLicense',
      name: 'Is manuscript licensed?',
    },
    {
      field: 'datasetsDeposited',
      name: 'Deposited generated dataset?',
    },
    {
      field: 'codeDeposited',
      name: 'Deposited generated code?',
    },
    {
      field: 'protocolsDeposited',
      name: 'Deposited generated protocols?',
    },
    {
      field: 'labMaterialsRegistered',
      name: 'Registered generated lab materials?',
    },
  ].forEach(({ field, name }) => {
    manuscriptVersions
      .createField(field)
      .name(name)
      .type('Symbol')
      .localized(false)
      .required(false)
      .validations([
        {
          in: ['Yes', 'No'],
        },
      ])
      .disabled(false)
      .omitted(false);

    manuscriptVersions
      .createField(`${field}Details`)
      .name(`${name} (Details)`)
      .type('Symbol')
      .localized(false)
      .required(false)
      .validations([])
      .disabled(false)
      .omitted(false);

    manuscriptVersions.changeFieldControl(
      `${field}Details`,
      'builtin',
      'singleLine',
      {},
    );
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

    'acknowledgedGrantNumberDetails',
    'asapAffiliationIncludedDetails',
    'manuscriptLicenseDetails',
    'datasetsDepositedDetails',
    'codeDepositedDetails',
    'protocolsDepositedDetails',
    'labMaterialsRegisteredDetails',
  ].forEach(manuscriptVersions.deleteField);
};
