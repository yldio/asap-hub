module.exports.description = 'Update Milestone Status to include Incomplete and Pending';

module.exports.up = (migration) => {
  const milestones = migration.editContentType('milestones');

  milestones.editField('status').validations([
    {
      in: [
        'Complete',
        'In Progress',
        'Pending',
        'Incomplete',
        'Not Started',
      ],
    },
  ]);
};

module.exports.down = (migration) => {
  const milestones = migration.editContentType('milestones');

  milestones.editField('status').validations([
    {
      in: ['Active', 'Not Started', 'Completed'],
    },
  ]);
};

