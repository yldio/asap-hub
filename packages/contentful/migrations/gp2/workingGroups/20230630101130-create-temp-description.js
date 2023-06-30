module.exports.description = 'Updates workingGroups description';

module.exports.up = (migration) => {
  const workingGroups = migration.editContentType('workingGroups');

  workingGroups
    .createField('oldDescription')
    .name('Old Description')
    .type('Text')
    .localized(false)
    .required(true)
    .validations([
      {
        size: {
          max: 2500,
        },
      },
    ])
    .disabled(false)
    .omitted(false);
};

module.exports.down = (migration) => {
  const workingGroups = migration.editContentType('workingGroups');
  workingGroups.deleteField('oldDescription');
};
