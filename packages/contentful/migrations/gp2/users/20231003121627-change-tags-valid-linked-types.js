module.exports.description = 'Change tags linked type';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');
  users.editField('tags').items({
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
  const users = migration.editContentType('users');
  users.editField('tags').items({
    type: 'Link',

    validations: [
      {
        linkContentType: ['keywords'],
      },
    ],

    linkType: 'Entry',
  });
};
