module.exports.description = 'Updates enums';

module.exports.up = (migration) => {
  const outputs = migration.editContentType('outputs');

  outputs.changeFieldControl('addedDate', 'builtin', 'datePicker', {
    ampm: '12',
    format: 'time',
    helpText:
      'Date output was shared with GP2 Network (different from publication date)',
  });
  outputs.changeFieldControl('lastUpdatedPartial', 'builtin', 'datePicker', {
    ampm: '12',
    format: 'time',
    helpText: 'Does not include changes to Publish Date and Admin notes',
  });
};

module.exports.down = (migration) => {
  const outputs = migration.editContentType('outputs');
  outputs.editField('documentType').items({
    type: 'Symbol',
    validations: [
      {
        in: [],
      },
    ],
  });
  outputs.editField('type').items({
    type: 'Symbol',
    validations: [
      {
        in: [],
      },
    ],
  });
};
