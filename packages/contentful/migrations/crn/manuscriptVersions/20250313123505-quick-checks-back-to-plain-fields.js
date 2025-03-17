module.exports.description =
  'Make manuscript version quick check details fields as plain fields again';
const quickCheckDetails = [
  {
    field: 'acknowledgedGrantNumberDetails',
    name: 'Included your grant number? (Details)',
  },
  {
    field: 'asapAffiliationIncludedDetails',
    name: 'ASAP Affiliation Included? (Details)',
  },
  {
    field: 'manuscriptLicenseDetails',
    name: 'Is manuscript licensed? (Details)',
  },
  {
    field: 'datasetsDepositedDetails',
    name: 'Deposited generated dataset? (Details)',
  },
  {
    field: 'codeDepositedDetails',
    name: 'Deposited generated code? (Details)',
  },
  {
    field: 'protocolsDepositedDetails',
    name: 'Deposited generated protocols? (Details)',
  },
  {
    field: 'labMaterialsRegisteredDetails',
    name: 'Registered generated lab materials? (Details)',
  },
  {
    field: 'availabilityStatementDetails',
    name: 'Included an Availability Statement? (Details)',
  },
];

module.exports.up = (migration, { makeRequest }) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');

  quickCheckDetails.forEach(({ field, name }) => {
    const tempFieldId = `${field}Temp`;

    manuscriptVersions.deleteField(field);

    manuscriptVersions
      .createField(tempFieldId)
      .name(name)
      .type('Symbol')
      .localized(false)
      .required(false)
      .validations([])
      .disabled(false)
      .omitted(false);

    manuscriptVersions.changeFieldId(tempFieldId, field);

    manuscriptVersions.changeFieldControl(field, 'builtin', 'singleLine', {});
    manuscriptVersions
      .moveField(field)
      .afterField(field.replace('Details', ''));
  });
};

module.exports.down = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');

  quickCheckDetails.forEach(({ field, name }) => {
    const tempMessageFieldId = `${field}Temp`;

    manuscriptVersions.deleteField(field);

    manuscriptVersions
      .createField(tempMessageFieldId)
      .name(name)
      .type('Link')
      .localized(false)
      .required(false)
      .validations([
        {
          linkContentType: ['discussions'],
        },
      ])
      .disabled(false)
      .omitted(false)
      .linkType('Entry');

    manuscriptVersions.changeFieldId(tempFieldId, field);
    manuscriptVersions
      .moveField(field)
      .afterField(field.replace('Details', ''));
  });
};
