module.exports.description =
  'Rename keywords field to tags and link to the Tag entity';

module.exports.up = (migration) => {
  const events = migration.editContentType('events');

  events.changeFieldId('keywords', 'tags');
  events
    .editField('tags')
    .name('Tags')
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['tags'],
        },
      ],

      linkType: 'Entry',
    });
  events.moveField('tags').afterField('thumbnail');
};

module.exports.down = (migration) => {
  const events = migration.editContentType('events');

  events.changeFieldId('tags', 'keywords');
  events
    .editField('keywords')
    .name('Keywords')
    .items({
      type: 'Link',

      validations: [
        {
          linkContentType: ['keywords'],
        },
      ],

      linkType: 'Entry',
    });
};
