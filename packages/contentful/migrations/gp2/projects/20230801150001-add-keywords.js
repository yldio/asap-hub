module.exports.description = 'Add tags to projects content model';

module.exports.up = (migration) => {
  const projects = migration.editContentType('projects');

  projects
    .createField('tags')
    .name('Tags')
    .type('Array')
    .localized(false)
    .required(true)
    .validations([
      {
        size: {
          min: 1,
          max: 6,
        },
      },
    ])
    .disabled(true)
    .omitted(false)
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['keywords'],
        },
      ],

      linkType: 'Entry',
    });

  projects.moveField('tags').afterField('keywords');
};

module.exports.down = (migration) => {
  migration.editContentType('projects').deleteField('tags');
};
