module.exports.description = 'Change tag linked type';

module.exports.up = (migration) => {
  const outputs = migration.editContentType('outputs');
  outputs.editField('tags').items({
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
  const outputs = migration.editContentType('outputs');
  outputs.editField('tags').items({
    type: 'Link',

    validations: [
      {
        linkContentType: ['keywords'],
      },
    ],

    linkType: 'Entry',
  });
};
