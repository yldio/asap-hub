module.exports.description = 'update validation start date';

module.exports.up = (migration) => {
  const projects = migration.editContentType('projects');
  projects.editField('startDate').required(false);
};

module.exports.down = (migration) => {
  const projects = migration.editContentType('projects');
  projects.editField('startDate').required(true);
};
