module.exports.description = 'Updates milestones';

module.exports.up = (migration) => {
  const milestones = migration.editContentType('milestones');

  milestones.editField('status').validations([
    {
      in: ['Active', 'Not Started', 'Completed'],
    },
  ]);
};

module.exports.down = (migration) => {
  const workingGroups = migration.editContentType('workingGroups');
};
