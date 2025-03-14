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
    const tempFieldName = `${name}Temp`;
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
    const tempMessageFieldName = `${name}Temp`;
    const tempMessageFieldId = `${field}Temp`;

    //create temp message field
    manuscriptVersions
      .createField(tempMessageFieldId)
      .name(tempMessageFieldName)
      .type('Link')
      .localized(false)
      .required(false)
      .validations([
        {
          linkContentType: ['messages'],
        },
      ])
      .disabled(false)
      .omitted(false)
      .linkType('Entry');

    //create temporary message entries from quick check details
    migration.deriveLinkedEntries({
      contentType: 'manuscriptVersions',
      from: [field, 'createdBy'],
      toReferenceField: tempMessageFieldId,
      derivedContentType: 'messages',
      derivedFields: ['text', 'createdBy'],
      identityKey: async () => {
        return uuid();
      },
      deriveEntryForLocale: async (from, locale) => {
        if (from[field] && from[field][locale]) {
          return {
            text: from[field][locale],
            createdBy: from.createdBy[locale],
          };
        }
      },
    });

    //update quick check details field type
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

    //populate new quick check details
    migration.deriveLinkedEntries({
      contentType: 'manuscriptVersions',
      from: [tempMessageFieldId],
      toReferenceField: field,
      derivedContentType: 'discussions',
      derivedFields: ['message'],
      identityKey: async () => {
        return uuid();
      },
      deriveEntryForLocale: async (from, locale) => {
        if (from[tempMessageFieldId] && from[tempMessageFieldId][locale]) {
          return {
            message: from[tempMessageFieldId][locale],
          };
        }
      },
    });

    manuscriptVersions.deleteField(tempMessageFieldId);
    manuscriptVersions
      .moveField(field)
      .afterField(field.replace('Details', ''));
  });
};
