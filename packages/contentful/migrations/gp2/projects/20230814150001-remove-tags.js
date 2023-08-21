module.exports.description = 'Remove keywords from projects content model';

module.exports.up = (migration) => {
  const projects = migration.editContentType('projects');

  projects.deleteField('keywords');
  projects.editField('tags').disabled(false);
};

module.exports.down = (migration) => {
  const projects = migration.editContentType('projects');

  projects
    .createField('keywords')
    .name('Keywords')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([
      {
        size: {
          min: 1,
          max: 6,
        },
      },
    ])
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',
      validations: [],
    });

  projects.editField('tags').disabled(true);
};
