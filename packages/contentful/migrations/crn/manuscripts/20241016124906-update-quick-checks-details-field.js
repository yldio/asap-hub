import { v4 as uuid } from 'uuid';

module.exports.description =
  'Update manuscript version quick check details fields';
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

module.exports.up = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');

  quickCheckDetails.forEach(({ field, name }) => {
    const tempFieldName = `${name} Temp`;
    const tempFieldId = `${field}Temp`;

    manuscriptVersions
      .createField(tempFieldId)
      .name(tempFieldName)
      .type('Symbol')
      .localized(false)
      .required(false)
      .validations([])
      .disabled(false)
      .omitted(false);

    migration.transformEntries({
      contentType: 'manuscriptVersions',
      from: [field],
      to: [tempFieldId],
      transformEntryForLocale: function (fromFields, currentLocale) {
        return { [tempFieldId]: fromFields[field][currentLocale] };
      },
    });

    manuscriptVersions.deleteField(field);

    manuscriptVersions
      .createField(field)
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

    migration.deriveLinkedEntries({
      contentType: 'manuscriptVersions',
      from: [tempFieldId, 'createdBy'],
      toReferenceField: field,
      derivedContentType: 'discussions',
      derivedFields: ['message'],
      identityKey: async () => {
        return uuid();
      },
      deriveEntryForLocale: async (from, locale) => {
        return {
          message: {
            text: from[tempFieldId][locale],
            createdBy: from.createdBy[locale],
          },
        };
      },
    });

    manuscriptVersions.deleteField(tempFieldId);
  });
};

module.exports.down = (migration) => {
  const manuscriptVersions = migration.editContentType('manuscriptVersions');

  quickCheckDetails.forEach(({ field, name }) => {
    const tempFieldName = `${name} Temp`;
    const tempFieldId = `${field}Temp`;

    manuscriptVersions
      .createField(tempFieldId)
      .name(tempFieldName)
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

    migration.transformEntries({
      contentType: 'manuscriptVersions',
      from: [field],
      to: [tempFieldId],
      transformEntryForLocale: function (fromFields, currentLocale) {
        return { [tempFieldId]: fromFields[field][currentLocale] };
      },
    });

    manuscriptVersions.deleteField(field);

    manuscriptVersions
      .createField(field)
      .name(name)
      .type('Symbol')
      .localized(false)
      .required(false)
      .validations([])
      .disabled(false)
      .omitted(false);

    migration.transformEntries({
      contentType: 'manuscriptVersions',
      from: [tempFieldId],
      to: [field],
      transformEntryForLocale: function (fromFields, currentLocale) {
        return { [field]: fromFields[tempFieldId][currentLocale].message.text };
      },
    });

    manuscriptVersions.deleteField(tempFieldId);
  });
};
