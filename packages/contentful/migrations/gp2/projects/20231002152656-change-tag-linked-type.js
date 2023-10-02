module.exports.description = 'Change tag linked type';

module.exports.up = (migration) => {
  const projects = migration.editContentType('projects');
  projects.editField('tags').items({
    type: 'Link',

    validations: [
      {
        linkContentType: ['tags'],
      },
    ],

    linkType: 'Entry',
  });
};

module.exports.down = (migration) => {
  const projects = migration.editContentType('projects');
  projects.editField('tags').items({
    type: 'Link',

    validations: [
      {
        linkContentType: ['keywords'],
      },
    ],

    linkType: 'Entry',
  });
};
