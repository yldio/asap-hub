module.exports.description =
  "Updates 'Waiting for ASAP Reply' to 'Waiting for OS Team Reply' in status field validation";

const transformField =
  (fieldName, fromValue, toValue) => (fromFields, currentLocale) => {
    if (
      fromFields[fieldName] &&
      fromFields[fieldName][currentLocale] === fromValue
    ) {
      return {
        [fieldName]: toValue,
      };
    }
    return undefined;
  };

module.exports.up = (migration) => {
  const manuscripts = migration.editContentType('manuscripts');

  manuscripts.editField('status').validations([
    {
      in: [
        'Waiting for Report',
        'Review Compliance Report',
        'Waiting for OS Team Reply',
        "Waiting for Grantee's Reply",
        'Manuscript Resubmitted',
        'Submit Final Publication',
        'Addendum Required',
        'Compliant',
        'Closed (other)',
      ],
    },
  ]);

  manuscripts.editField('previousStatus').validations([
    {
      in: [
        'Waiting for Report',
        'Review Compliance Report',
        'Waiting for OS Team Reply',
        "Waiting for Grantee's Reply",
        'Manuscript Resubmitted',
        'Submit Final Publication',
        'Addendum Required',
        'Compliant',
        'Closed (other)',
      ],
    },
  ]);

  migration.transformEntries({
    contentType: 'manuscripts',
    from: ['status'],
    to: ['status'],
    transformEntryForLocale: transformField(
      'status', // field name
      'Waiting for ASAP Reply', // old value
      'Waiting for OS Team Reply', // new value
    ),
  });

  migration.transformEntries({
    contentType: 'manuscripts',
    from: ['previousStatus'],
    to: ['previousStatus'],
    transformEntryForLocale: transformField(
      'previousStatus', //field name
      'Waiting for ASAP Reply', // old value
      'Waiting for OS Team Reply', // new value
    ),
  });
};

module.exports.down = (migration) => {
  const manuscripts = migration.editContentType('manuscripts');

  manuscripts.editField('status').validations([
    {
      in: [
        'Waiting for Report',
        'Review Compliance Report',
        'Waiting for ASAP Reply',
        "Waiting for Grantee's Reply",
        'Manuscript Resubmitted',
        'Submit Final Publication',
        'Addendum Required',
        'Compliant',
        'Closed (other)',
      ],
    },
  ]);

  manuscripts.editField('previousStatus').validations([
    {
      in: [
        'Waiting for Report',
        'Review Compliance Report',
        'Waiting for ASAP Reply',
        "Waiting for Grantee's Reply",
        'Manuscript Resubmitted',
        'Submit Final Publication',
        'Addendum Required',
        'Compliant',
        'Closed (other)',
      ],
    },
  ]);

  migration.transformEntries({
    contentType: 'manuscripts',
    from: ['status'],
    to: ['status'],
    transformEntryForLocale: transformField(
      'status', // field name
      'Waiting for OS Team Reply', // old value
      'Waiting for ASAP Reply', // new value
    ),
  });

  migration.transformEntries({
    contentType: 'manuscripts',
    from: ['previousStatus'],
    to: ['previousStatus'],
    transformEntryForLocale: transformField(
      'previousStatus', // field name
      'Waiting for OS Team Reply', // old value
      'Waiting for ASAP Reply', // new value
    ),
  });
};
