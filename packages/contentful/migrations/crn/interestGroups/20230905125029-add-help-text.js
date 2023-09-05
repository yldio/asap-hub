module.exports.description = 'Add help texts copied from Squidex';

module.exports.up = (migration) => {
  const interestGroups = migration.editContentType('interestGroups');

  interestGroups.changeFieldControl('active', 'builtin', 'boolean', {
    helpText:
      'Active groups have Subscribe buttons and Calendar and Upcoming Events tabs',
    trueLabel: 'Yes',
    falseLabel: 'No',
  });
};

module.exports.down = (migration) => {
  const interestGroups = migration.editContentType('interestGroups');
  interestGroups.changeFieldControl('active', 'builtin', 'boolean', {
    trueLabel: 'Yes',
    falseLabel: 'No',
  });
};
