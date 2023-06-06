module.exports.description = 'remove keyword validation';

module.exports.up = (migration) => {
  const projects = migration.editContentType('projects');
  projects.editField('keywords').validations([
    {
      size: {
        min: 1,
        max: 6,
      },
    },
  ]);
  projects.editField('keywords').items({
    type: 'Symbol',
    validations: [],
  });
  projects.changeFieldControl('keywords', 'builtin', 'tagEditor', {});
};

module.exports.down = (migration) => {};
