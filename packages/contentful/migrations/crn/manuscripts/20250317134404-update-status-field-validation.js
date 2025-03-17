module.exports.description =
  "Removes Waiting for OS Team Reply and Waiting for Grantee's Reply statuses";

module.exports.up = (migration) => {
  const manuscripts = migration.editContentType('manuscripts');

  manuscripts.editField('status').validations([
    {
      in: [
        'Waiting for Report',
        'Review Compliance Report',
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
        'Manuscript Resubmitted',
        'Submit Final Publication',
        'Addendum Required',
        'Compliant',
        'Closed (other)',
      ],
    },
  ]);
};

module.exports.down = (migration) => {
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
};
