module.exports.description = 'Change tags linked type';

module.exports.up = (migration) => {
  const workingGroups = migration.editContentType('workingGroups');
  workingGroups.editField('tags').items({
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
  const workingGroups = migration.editContentType('workingGroups');
  workingGroups.editField('tags').items({
    type: 'Link',

    validations: [
      {
        linkContentType: ['keywords'],
      },
    ],

    linkType: 'Entry',
  });
};
