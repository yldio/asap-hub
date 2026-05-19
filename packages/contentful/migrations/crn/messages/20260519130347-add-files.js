module.exports.description = 'Add files field to messages';

module.exports.up = (migration) => {
  const messages = migration.editContentType('messages');

  messages
    .createField('files')
    .name('Files')
    .type('Array')
    .localized(false)
    .required(false)
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Link',
      validations: [],
      linkType: 'Asset',
    });

  messages.moveField('files').afterField('text');
};

module.exports.down = (migration) => {
  const messages = migration.editContentType('messages');
  messages.deleteField('files');
};
